import Router from "express";
import session from 'express-session';
import UsersDAO from "../daos/users.dao.js";
import passport from "passport";

const router = Router()

router.post("/register", async (req, res) => {

    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let age = parseInt(req.body.age);
    let password = req.body.password;

    if(!first_name || !last_name || !email || !age || !password){
        res.redirect("/register");
    }

    let emailUsed = await UsersDAO.getUserByEmail(email);

    if(emailUsed){
        res.redirect("/register");
    } else {
        await UsersDAO.insert(first_name,last_name,age,email,password);
        res.redirect("/login");
    }

})

router.post("/login", async (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    if(!email || !password){
        res.redirect("/login");
    }

    let user = await UsersDAO.getUserByCreds(email, password);

    if(!user){
        res.redirect("/login");
    } else {
        req.session.user = user._id;
        if (user.role === 'admin') { 
            req.session.isAdmin = true;
            res.redirect("/panel-administracion");
        } else {
            req.session.isAdmin = false;
            res.redirect("/store/products");
        }
    }

})

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/login");
    });
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/store/products",
    failureRedirect: "/login", 
    failureFlash: true
}));

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }, 
    async(req, res)=>{
    }
));

router.get(
    "/github/callback",
    passport.authenticate("github", {
        failureRedirect: "/login",
    }),
    async(req, res)=>{
        req.session.user = req.user;
        res.redirect("/store/products")
    }
);

router.get("/current", (req, res) => {
    if (req.session && req.session.user) {
        // Si hay un usuario en la sesión, devolvemos el usuario actual
        const userId = req.session.user;
        // Aquí podríamos buscar el usuario en la base de datos y devolverlo
        // Por ahora, simplemente devolvemos el ID del usuario
        res.status(200).json({ userId });
    } else {
        // Si no hay un usuario en la sesión, devolvemos un error
        res.status(401).json({ message: "No hay sesión de usuario activa" });
    }
});



export default router;