import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function DonateTefilinForm() {
  const [step, setStep] = useState(1);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("תודה! ניצור איתך קשר לאיסוף התפילין");
    setStep(1);
  };

  return (
    <section id="donate" className="py-20 px-4 bg-cream">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-display font-bold text-3xl md:text-[32px] text-ink leading-tight">
            יש לך תפילין מיותרות?
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            אנא מלא את הטופס כדי שתוכל לקיים בהם מצוה חשובה וזיכוי הרבים!
          </p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-3xl p-8 md:p-10 shadow-card border border-border space-y-5">
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2].map((n) => (
              <div key={n} className={`h-2 w-12 rounded-full ${step >= n ? "bg-teal-deep" : "bg-border"}`} />
            ))}
          </div>

          {step === 1 ? (
            <>
              <Field label="שם מלא"><Input className="h-12" required /></Field>
              <Field label="כתובת לאיסוף"><Input className="h-12" /></Field>
              <Field label="מצב התפילין">
                <Select defaultValue="חדש">
                  <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["חדש", "משומש", "פגום / ישן מאוד"].map((o) => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <button type="button" onClick={() => setStep(2)} className="btn-e btn-form">
                הבא
              </button>
            </>
          ) : (
            <>
              <Field label="אימייל"><Input type="email" className="h-12" /></Field>
              <Field label="טלפון"><Input type="tel" className="h-12" required /></Field>
              <Field label="רוצים להוסיף הקדשה?"><Textarea rows={3} /></Field>
              <p className="text-xs text-muted-foreground text-center">
                בשליחת הבקשה לא יעשה שום שימוש במידע שהזנתם מלבד לצרכים הטכניים של העמותה.
              </p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-e btn-outline-navy flex-1 h-12 text-xl">הקודם</button>
                <button type="submit" className="btn-e btn-form flex-1">שליחה</button>
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-bold text-ink mb-2">{label}</span>
      {children}
    </label>
  );
}
