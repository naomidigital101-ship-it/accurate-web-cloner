import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function RequestForm() {
  const [step, setStep] = useState(1);

  const next = () => setStep((s) => Math.min(3, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("הבקשה נשלחה! ניצור איתך קשר בהקדם");
    setStep(1);
  };

  return (
    <section id="request" className="relative bg-gradient-hero py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center text-white mb-8">
          <h2 className="font-display font-black text-4xl md:text-5xl">
            רוצה להניח תפילין משלך?
          </h2>
          <p className="mt-3 text-white/90 text-lg">
            אנא מלא את הטופס המצורף כדי שנוכל לעזור לך לקבל תפילין משלך!
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-white rounded-3xl p-8 md:p-10 shadow-card border-4 border-teal/40"
        >
          {/* Stepper */}
          <div className="flex justify-center gap-2 mb-8" aria-label="התקדמות בטופס">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-2 w-12 rounded-full transition-colors ${
                  step >= n ? "bg-teal-deep" : "bg-border"
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-5">
              <Field label="למי מיועדות התפילין">
                <Select defaultValue="חייל">
                  <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["חייל", "בר מצווה", "מתחזק", "אחר"].map((o) => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="כותב ביד">
                <Select defaultValue="ימין">
                  <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ימין">ימין</SelectItem>
                    <SelectItem value="שמאל">שמאל</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="שיטת אספקה">
                <Select defaultValue="איסוף">
                  <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="איסוף">אוכל להגיע לאסוף את התפילין</SelectItem>
                    <SelectItem value="משלוח">מבקש משלוח (בתוספת תשלום)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Button
                type="button"
                onClick={next}
                className="w-full h-12 rounded-full bg-teal hover:bg-teal-deep text-ink font-bold text-lg"
              >
                הבא
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <Field label="שם פרטי"><Input className="h-12" required /></Field>
              <Field label="שם משפחה"><Input className="h-12" required /></Field>
              <Field label="כתובת למסירה"><Input className="h-12" /></Field>
              <Field label="עיר / ישוב"><Input className="h-12" /></Field>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={prev} className="flex-1 h-12 rounded-full">
                  הקודם
                </Button>
                <Button type="button" onClick={next} className="flex-1 h-12 rounded-full bg-teal hover:bg-teal-deep text-ink font-bold">
                  הבא
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <Field label="טלפון"><Input type="tel" className="h-12" required /></Field>
              <Field label="אימייל"><Input type="email" className="h-12" /></Field>
              <p className="text-xs text-muted-foreground text-center">
                בשליחת הבקשה לא יעשה שום שימוש במידע שהזנתם מלבד לצרכים הטכניים של העמותה.
              </p>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={prev} className="flex-1 h-12 rounded-full">
                  הקודם
                </Button>
                <Button type="submit" className="flex-1 h-12 rounded-full bg-teal hover:bg-teal-deep text-ink font-bold">
                  שליחת בקשה
                </Button>
              </div>
            </div>
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
