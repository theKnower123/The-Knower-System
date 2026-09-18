<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class HostingExpiring extends Notification implements ShouldQueue
{
    use Queueable;

    public $type;
    public $name;
    public $expiryDate;

    public function __construct(string $type, string $name, string $expiryDate)
    {
        $this->type = $type;
        $this->name = $name;
        $this->expiryDate = $expiryDate;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'hosting_expiring',
            'title' => ucfirst($this->type) . ' Expiring Soon: ' . $this->name,
            'message' => "The {$this->type} {$this->name} is expiring on {$this->expiryDate}.",
            'url' => '/hosting',
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}
