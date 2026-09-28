import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CheckoutForm from "@/components/CheckoutForm";
import { prisma } from "@/lib/prisma";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  let savedAddresses: any[] = [];
  if (session?.user?.id) {
    savedAddresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <CheckoutForm 
      prefillData={{ 
        name: session?.user?.name || "", 
        email: session?.user?.email || "" 
      }} 
      savedAddresses={savedAddresses}
    />
  );
}
