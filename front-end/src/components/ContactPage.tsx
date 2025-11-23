import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface Props {
  onNavigate: (page: string) => void;
}

export function ContactPage({ onNavigate }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: hook up ordering backend
    console.log('Order/request', { name, phone, message });
    setName(''); setPhone(''); setMessage('');
    alert('Merci ! Nous avons reçu votre message.');
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Commander / Contact</h1>
          <Button onClick={() => onNavigate('home')}>Retour</Button>
        </div>

        <div className="max-w-2xl bg-white rounded-lg p-6 shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Votre nom" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input placeholder="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <label className="sr-only">Message</label>
            <textarea className="w-full border rounded-md p-3" placeholder="Détails de la commande / message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} />
            <div className="flex gap-4">
              <Button type="submit">Envoyer</Button>
              <Button variant="outline" onClick={() => { setName(''); setPhone(''); setMessage(''); }}>Effacer</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
