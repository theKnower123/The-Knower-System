<?php

namespace App\Mail;

use App\Modules\GraduationProjects\Models\GraduationProject;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class GraduationProjectQuoted extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public GraduationProject $graduationProject)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Graduation Project Quotation — {$this->graduationProject->reference_id}",
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: $this->buildHtml(),
        );
    }

    protected function buildHtml(): string
    {
        $gp = $this->graduationProject;
        $price = $gp->quoted_price !== null
            ? number_format((float) $gp->quoted_price, 2) . ' EGP'
            : 'TBD';
        $team = e($gp->team_name);
        $ref = e($gp->reference_id);
        $name = e($gp->primary_contact_name);

        return <<<HTML
        <div style="font-family:sans-serif;line-height:1.6;color:#111">
          <h2>Your graduation project quotation</h2>
          <p>Hi {$name},</p>
          <p>We reviewed submission <strong>{$ref}</strong> for team <strong>{$team}</strong>.</p>
          <p>Quoted price: <strong>{$price}</strong></p>
          <p>Please reply to confirm or reach us on WhatsApp to proceed with the deposit and kickoff.</p>
          <p>— The Knower Team</p>
        </div>
        HTML;
    }
}
