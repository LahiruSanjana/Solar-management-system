export{};

export type Role="admin";

declare global{
    interface CustomJwtSessionClaims{
        meteadata?:{
            role?:Role;
        };
    }
}