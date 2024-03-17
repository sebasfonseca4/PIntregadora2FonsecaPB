import { Router} from "express";
import ProductDAO from "../daos/products.dao.js";
import UsersDAO from "../daos/users.dao.js";
import CartDAO from "../daos/carts.dao.js";

const router = Router();
export default router;

router.get("/products", async (req, res) => {
  try {
    const products = await ProductDAO.getAll();
    const userId = req.session.user;
    const user = await UsersDAO.getUserByID(userId);
    res.render("products", { user, products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error obteniendo productos");
  }
});

router.get('/products/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
      const product = await ProductDAO.getById(pid);
      res.render('detailProduct', { product });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error obteniendo detalle del producto');
  }
});

router.post("/addCart", async (req, res) => {
  const { productId } = req.body;
  try {
    const userId = req.session.user;
    await CartDAO.addProduct(userId, productId);
    res.redirect("/store/products");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error agregando producto al carrito");
  }
});