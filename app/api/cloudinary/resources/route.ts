import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/cloudinary/resources
 * Fetch all resources (images and videos) from Cloudinary folder using Search API
 * 
 * Requires environment variables:
 * - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET
 */
export async function GET(request: NextRequest) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary credentials not configured" },
      { status: 500 }
    );
  }

  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const nextCursor = searchParams.get("next_cursor");
    const resourceType = searchParams.get("resource_type") || "image"; // image or video

    // Build search expression for meek_portfolio folder
    const expression = `folder:meek_portfolio/* AND resource_type:${resourceType}`;

    // Build the API URL for Search API
    const params = new URLSearchParams({
      expression: expression,
      max_results: "30",
      ...(nextCursor && { next_cursor: nextCursor }),
    });

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/search?${params}`;

    // Create Basic Auth header
    const authString = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${authString}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary API error:", errorText);
      throw new Error(`Cloudinary API error: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      resources: data.resources || [],
      next_cursor: data.next_cursor,
      total_count: data.total_count || 0,
    });
  } catch (error) {
    console.error("Error fetching Cloudinary resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cloudinary/resources
 * Delete a resource from Cloudinary
 */
export async function DELETE(request: NextRequest) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary credentials not configured" },
      { status: 500 }
    );
  }

  try {
    const { publicId, resourceType = "image" } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { error: "publicId is required" },
        { status: 400 }
      );
    }

    // Use the destroy endpoint to delete a single resource
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`;
    const authString = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    const formData = new URLSearchParams();
    formData.append("public_id", publicId);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary delete error:", errorText);
      throw new Error(`Failed to delete resource: ${response.statusText}`);
    }

    const result = await response.json();

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting Cloudinary resource:", error);
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}
