// import { PrismaClient } from "@prisma/client";
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation,
  // useLoaderData,
  // useNavigation,
} from "@remix-run/react";
import { twMerge } from "tailwind-merge";
import { PrismaClient } from "@prisma/client";

 const prisma = new PrismaClient(); // 🤖 Agrega el cliente de la base de datos

export const action = async ({ request }: ActionFunctionArgs) => {
  // 🤖 Guarda el usuario aquí
  const formData = await request.formData();
  const data = {
    displayName: String(formData.get("displayName")),
    email: String(formData.get("email"))
  };
  // Aquí podemos validar con zod @TODO
  //prisma.user.upsert({where:{email: data.email}})
  //let resultado=await prisma.user.findUnique({where: { email: data.email}})
  try {
    await prisma.user.create({ data }); // podríamos capturar un error con try
  } catch (error) {
    const resultado = await prisma.user.update({ where:{ id: String(formData.get("id")) }, data });
    if(!resultado){
      return { ok: false, mensaje: 'Email registrado previamente' }; // Siempre devuelve por lo menos null en un action  
    } 
    return { ok: true, mensaje: 'Datos Actualizados' }; // Siempre devuelve por lo menos null en un action  
  }
  return { ok: true, mensaje: 'Listo todo en orden' }; // Siempre devuelve por lo menos null en un action
  /*if(!resultado)
    await prisma.user.create({ data }); // podríamos capturar un error con try
  else{
    await prisma.user.update({ where:{ id: data.id }, data });
    resultado= data
  }    
  return !resultado ? { ok: true, mensaje: 'Listo todo en orden' } : { ok: false, mensaje: 'Email registrado previamente' }     ; // Siempre devuelve por lo menos null en un action
  */
  //return redirect(`/valida?email=${data.email}&displayName=${data.displayName}`)
  //return redirect(`/valida`,{body:{displayName: data.displayName, email: data.email}})
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const email= url.searchParams.get('email')
  if(!email){
    return {email: undefined, displayName:undefined, id:undefined}
  }
  // 🤖 Consigue al usuario a partir de los Search Params
  const listado=await prisma.user.findMany()
  console.log("SQLITE",listado)
  const user=await prisma.user.findUnique({where: { email: email}})
  if(!user){
    return {email: undefined, displayName:undefined, id:undefined}
  }
  // @TODO: if(!user)
  return user;
};

export default function Index() {
  const {email, displayName, id} = useLoaderData<typeof loader>();
  const actionData = useActionData();
  const navigation = useNavigation();
  console.log("NAVIGATION?",navigation)
  // 🤖 Consigue los datos del loader
  // 🤖 Consigue los datos del action (feedback)
  // const navigation = useNavigation();

  // states
  const isDisabled = navigation.state !== "idle";

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-200">
      <Form
        method="post"
        className="min-w-[320px] bg-white shadow rounded-xl pt-8 pb-6 px-6"
      >
        <input type="hidden" name="id" value={id ?? undefined} /> {/*🤖 Agrega el id para la edición */}
        <TextField
          placeholder="Tu nombre"
          name="displayName"
          label="Nombre de usuario"
          defaultValue={displayName ?? ""} //🤖 Agrega los valores por default
        />
        <TextField
          placeholder="Tu correo"
          name="email"
          label="Correo"
          defaultValue={email} // 🤖 Agrega los valores por default
        />
        <button
          disabled={isDisabled}
          className={twMerge(
            "mt-6 bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 px-4 rounded-lg w-full hover:from-indigo-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-800"
          )}
          type="submit" // 👀 Esto es muy importante
        >
          {isDisabled ? "Cargando..." : "Guardar"}
          {/*Guardar*/}
        </button>
      </Form>

      {/* 🤖 Agrega el Toast aquí */}
      { actionData?.ok && (<p className="p-4 bg-green-300 text-green-700 rounded-xl fixed top-6">{actionData?.mensaje}</p>) }
      { !actionData?.ok && (<p className="p-4 bg-red-300 text-red-700 rounded-xl fixed top-6">{actionData?.mensaje}</p>) }
      {/* !email && !id && !displayName && (<p className="p-4 bg-red-300 text-red-700 rounded-xl fixed top-6">Usuario no registrado</p>) */}
      
    </main>
  );
}

const TextField = ({
  name,
  placeholder,
  label,
  defaultValue,
}: {
  defaultValue?: string;
  name: string;
  placeholder?: string;
  label: string;
}) => {
  return (
    <p className="grid gap-2 py-2">
      <label htmlFor={name}>{label}</label>
      <input
        defaultValue={defaultValue}
        placeholder={placeholder}
        type="text"
        name={name}
        className="border rounded-lg py-2 px-4"
      />
    </p>
  );
};
