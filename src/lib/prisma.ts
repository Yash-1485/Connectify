// import { PrismaClient } from "../generated/prisma";
import { PrismaClient } from "../../generated/prisma";

// const prismaClientSingleton = () => {
//     return new PrismaClient();
// };

// declare const globalThis: {
//     prismaGlobal: ReturnType<typeof prismaClientSingleton>;
// } & typeof global;

// const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();0

// export default prisma;

// if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

const prisma = new PrismaClient();
export default prisma;