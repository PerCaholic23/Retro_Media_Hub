const express = require("express");
const router = express.Router();

/* ===========================
   MOCK DATA
=========================== */

const products = [
  {
    id: 1,
    name: "อัลบั้มแรก",
    artist: "ศิลปิน A",
    price: 590,
    image: "https://via.placeholder.com/150",
    stock: 10,
    category_slug: "cd",
  },
  {
    id: 2,
    name: "Limited Vinyl",
    artist: "ศิลปิน B",
    price: 1200,
    image: "https://via.placeholder.com/150",
    stock: 0,
    category_slug: "vinyl",
  },
];

/* ===========================
   GET CATEGORY SUMMARY
=========================== */
router.get("/", (req, res) => {
  const summary = {};

  products.forEach((item) => {
    if (!summary[item.category_slug]) {
      summary[item.category_slug] = 0;
    }
    summary[item.category_slug] += 1;
  });

  const result = Object.keys(summary).map((key) => ({
    category_slug: key,
    totalStock: summary[key],
  }));

  res.json(result);
});

/* ===========================
   GET PRODUCTS BY CATEGORY
=========================== */
router.get("/:slug", (req, res) => {
  const { slug } = req.params;

  const filtered = products.filter(
    (item) => item.category_slug === slug
  );

  res.json(filtered);
});

module.exports = router;