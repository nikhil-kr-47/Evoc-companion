import { NextResponse } from "next/server";

interface ExtractedDetails {
  domain: string;
  brandName: string;
  tagline: string;
  businessModel: string;
  brandVibe: string;
  description: string;
  detailedSummary: string;
  heroProducts: string[];
  uniqueSellingPoints: string[];
  targetAudience: string;
  detectedKeywords: string[];
  adHooks: {
    problemSolution: string;
    socialProof: string;
    offerUrgency: string;
  };
  recommendedFormat: string;
  adAngles: string[];
  aiProvider: string;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, message: "A valid website URL is required" },
        { status: 400 }
      );
    }

    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    const domain = new URL(targetUrl).hostname.replace(/^www\./, "");
    const baseBrandName = domain.split(".")[0];
    const fallbackBrand = baseBrandName.charAt(0).toUpperCase() + baseBrandName.slice(1);

    let rawHtml = "";
    let pageTitle = "";
    let metaDescription = "";
    let ogTitle = "";
    let ogDescription = "";
    let ogSiteName = "";
    let jsonLdData: any[] = [];
    let headings: string[] = [];
    let detectedProducts: string[] = [];
    let detectedUsps: string[] = [];

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const res = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        rawHtml = await res.text();

        // 1. Title
        const titleMatch = rawHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch) pageTitle = titleMatch[1].trim();

        // 2. Meta Description
        const descMatch =
          rawHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
          rawHtml.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
        if (descMatch) metaDescription = descMatch[1].trim();

        // 3. OpenGraph tags
        const ogTitleMatch = rawHtml.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
        if (ogTitleMatch) ogTitle = ogTitleMatch[1].trim();

        const ogDescMatch = rawHtml.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
        if (ogDescMatch) ogDescription = ogDescMatch[1].trim();

        const ogSiteNameMatch = rawHtml.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i);
        if (ogSiteNameMatch) ogSiteName = ogSiteNameMatch[1].trim();

        // 4. JSON-LD structured data (Products, Organizations, Offers)
        const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
        let match;
        while ((match = jsonLdRegex.exec(rawHtml)) !== null) {
          try {
            const parsed = JSON.parse(match[1]);
            if (Array.isArray(parsed)) {
              jsonLdData.push(...parsed);
            } else {
              jsonLdData.push(parsed);
            }
          } catch (e) {
            // Ignore malformed JSON-LD
          }
        }

        // Extract products from JSON-LD
        for (const item of jsonLdData) {
          if (item["@type"] === "Product" && item.name) {
            detectedProducts.push(item.name);
          } else if (Array.isArray(item["@graph"])) {
            for (const subItem of item["@graph"]) {
              if (subItem["@type"] === "Product" && subItem.name) {
                detectedProducts.push(subItem.name);
              }
            }
          }
        }

        // 5. Headings (H1, H2)
        const h1Regex = /<h1[^>]*>([^<]+)<\/h1>/gi;
        let h1Match;
        while ((h1Match = h1Regex.exec(rawHtml)) !== null) {
          const text = h1Match[1].replace(/\s+/g, " ").trim();
          if (text.length > 3 && text.length < 100) headings.push(text);
        }

        const h2Regex = /<h2[^>]*>([^<]+)<\/h2>/gi;
        let h2Match;
        while ((h2Match = h2Regex.exec(rawHtml)) !== null && headings.length < 6) {
          const text = h2Match[1].replace(/\s+/g, " ").trim();
          if (text.length > 3 && text.length < 80) headings.push(text);
        }

        // 6. Detect Trust Signals & USPs from HTML body
        const uspPatterns = [
          { pattern: /free\s+shipping|free\s+delivery/i, label: "Free Shipping Nationwide" },
          { pattern: /cash\s+on\s+delivery|\bcod\b/i, label: "Cash on Delivery (COD) Available" },
          { pattern: /easy\s+returns?|7[\s-]day\s+returns?|14[\s-]day\s+returns?/i, label: "Hassle-Free Return Policy" },
          { pattern: /handcrafted|handmade|hand-woven|artisan/i, label: "100% Handcrafted Quality" },
          { pattern: /organic|100%\s+natural|chemical[\s-]free/i, label: "Certified Natural & Organic" },
          { pattern: /secure\s+payment|256[\s-]bit\s+ssl|safe\s+checkout/i, label: "100% Secure Checkout" },
          { pattern: /24\/7\s+support|live\s+chat|customer\s+care/i, label: "24/7 Dedicated Customer Support" },
          { pattern: /made\s+in\s+india|make\s+in\s+india/i, label: "Proudly Made in India" },
          { pattern: /money[\s-]back\s+guarantee|100%\s+satisfaction/i, label: "Money-Back Guarantee" },
        ];

        for (const usp of uspPatterns) {
          if (usp.pattern.test(rawHtml) && !detectedUsps.includes(usp.label)) {
            detectedUsps.push(usp.label);
          }
        }
      }
    } catch (scrapeErr: any) {
      console.warn("[analyze-website] Live scrape note:", scrapeErr.message);
    }

    // Clean brand name
    const finalBrandName = ogSiteName || fallbackBrand;
    const finalTitle = ogTitle || pageTitle || `${finalBrandName} Online Store`;
    const finalDesc =
      ogDescription ||
      metaDescription ||
      `${finalBrandName} provides curated products and specialized solutions engineered for measurable customer value.`;

    const combinedText = `${finalTitle} ${finalDesc} ${headings.join(" ")}`.toLowerCase();

    // Strictly enforce GEMINI_API_KEY from environment variables
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Configuration Error: GEMINI_API_KEY environment variable is not configured.",
        },
        { status: 500 }
      );
    }

    try {
      const prompt = `You are an elite Meta Ads strategist and e-commerce auditor.
Analyze the following extracted content from the website "${targetUrl}" and generate a structured ad intelligence dossier.

Brand: ${finalBrandName}
Domain: ${domain}
Page Title: ${finalTitle}
Meta Description: ${finalDesc}
Key Headings: ${headings.slice(0, 5).join(" | ")}
Detected Products: ${detectedProducts.slice(0, 5).join(", ")}
Trust Signals: ${detectedUsps.join(", ")}

Respond with STRICTLY valid JSON (no markdown formatting, no code fences):
{
  "brandName": "${finalBrandName}",
  "tagline": "A punchy 5-8 word brand tagline",
  "businessModel": "D2C E-Commerce | B2B Services | Lead Gen Agency | High-Ticket Coaching",
  "brandVibe": "Luxury & Premium | Modern Minimalist | Vibrant & Gen-Z | Trusted Healthcare",
  "detailedSummary": "A concise 2-sentence summary of what they sell, their ideal customer, and primary differentiator.",
  "heroProducts": ["Product 1", "Product 2", "Product 3"],
  "uniqueSellingPoints": ["USP 1", "USP 2", "USP 3"],
  "targetAudience": "Specific age range, lifestyle, and persona",
  "detectedKeywords": ["keyword1", "keyword2", "keyword3", "keyword4"],
  "adHooks": {
    "problemSolution": "Pain point hook suitable for Meta Feed ad copy",
    "socialProof": "Review, authority or star-rating hook",
    "offerUrgency": "Urgent CTA or introductory incentive hook"
  },
  "recommendedFormat": "Recommended Meta ad creative format (e.g. 1:1 Carousel, 9:16 Video Reel)",
  "adAngles": [
    "Angle 1: Hook description",
    "Angle 2: Hook description",
    "Angle 3: Hook description"
  ]
}`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.2,
            },
          }),
        }
      );

      if (!geminiRes.ok) {
        const errText = await geminiRes.text().catch(() => "");
        return NextResponse.json(
          {
            success: false,
            message: `Gemini API Error (${geminiRes.status}): ${errText}`,
          },
          { status: 502 }
        );
      }

      const geminiData = await geminiRes.json();
      const jsonText =
        geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const parsedGemini = JSON.parse(jsonText);

      return NextResponse.json({
        success: true,
        analysis: {
          ...parsedGemini,
          domain,
          aiProvider: "Google Gemini 1.5 Flash (Live Generative Model)",
        },
      });
    } catch (geminiErr: any) {
      console.error("[analyze-website] Gemini processing error:", geminiErr);
      return NextResponse.json(
        {
          success: false,
          message: `AI Analysis Error: ${geminiErr?.message || "Failed to process website with Gemini"}`,
        },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("[analyze-website] Error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Failed to analyze website" },
      { status: 500 }
    );
  }
}
