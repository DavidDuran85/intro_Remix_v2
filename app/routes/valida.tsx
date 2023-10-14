// import { PrismaClient } from "@prisma/client";
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation, useSearchParams,
  // useLoaderData,
  // useNavigation,
} from "@remix-run/react";
import { twMerge } from "tailwind-merge";
import { PrismaClient } from "@prisma/client";

 const prisma = new PrismaClient(); // 🤖 Agrega el cliente de la base de datos

export const action = async ({ request }: ActionFunctionArgs) => {
  // 🤖 Guarda el usuario aquí
  return null; // Siempre devuelve por lo menos null en un action
  //return redirect("/")
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("REQUEST",request)
  const params= useSearchParams();
  
  const data = {
    displayName: params.get('displayName'),
    email: params.get('email'),
  };
  const resultado=await prisma.user.findUnique({where: { email: data.email}})
  return resultado;
};

export default function Index() {
  const info = useLoaderData();
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-200">
      { info?.displayName && (<p className="p-4 bg-red-300 text-red-700 rounded-xl fixed top-6">{info?.displayName}</p>) }
      { info?.email && (<p className="p-4 bg-red-300 text-red-700 rounded-xl fixed top-6">{info?.email}</p>) }
      
    </main>
  );
}
