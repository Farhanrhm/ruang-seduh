import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AuthPromptCheckout from "@/components/AuthPromptCheckout";
import CheckoutForm from "@/components/CheckoutForm";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <AuthPromptCheckout />;
  }

  return <CheckoutForm />;
}
