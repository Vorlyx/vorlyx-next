import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { helpNeeds, budget, howMet, fullName, email, company, message } = body;

    // Validate required fields
    if (!fullName?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Full name and email are required" },
        { status: 400 }
      );
    }

    // Build the email HTML
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #171717; border-bottom: 2px solid #24B444; padding-bottom: 10px;">
          New Project Inquiry from Vorlyx.com
        </h2>

        <h3 style="color: #171717; margin-top: 30px;">Contact Info</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; width: 150px;"><strong>Name:</strong></td>
            <td>${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Email:</strong></td>
            <td><a href="mailto:${email}" style="color: #24B444;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Company:</strong></td>
            <td>${company || "Not provided"}</td>
          </tr>
        </table>

        <h3 style="color: #171717; margin-top: 30px;">Project Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; width: 200px; vertical-align: top;"><strong>How can we help:</strong></td>
            <td>${
              Array.isArray(helpNeeds) && helpNeeds.length > 0
                ? helpNeeds.join(", ")
                : "Not specified"
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; vertical-align: top;"><strong>Budget:</strong></td>
            <td>${budget || "Not specified"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; vertical-align: top;"><strong>How they found us:</strong></td>
            <td>${
              Array.isArray(howMet) && howMet.length > 0
                ? howMet.join(", ")
                : "Not specified"
            }</td>
          </tr>
        </table>

        <h3 style="color: #171717; margin-top: 30px;">Message</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; white-space: pre-wrap; line-height: 1.5;">
${message || "No message provided"}
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="color: #888; font-size: 12px; text-align: center;">
          Sent from vorlyx.com contact form
        </p>
      </div>
    `;

    // Send the email via Resend
    const { data, error } = await resend.emails.send({
      from: "Vorlyx Contact <noreply@vorlyx.com>",
      to: [process.env.CONTACT_EMAIL || "hello@vorlyx.com"],
      replyTo: email, // Lets you reply directly to the person who submitted
      subject: `New Project Inquiry from ${fullName}${
        company ? ` (${company})` : ""
      }`,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}