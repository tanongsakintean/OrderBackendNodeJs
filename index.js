require("dotenv").config();
const express = require("express");
const app = express();
const Sequelize = require("sequelize");

const port = process.env.PORT || 3001;

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  storage: "./Database/Orders.sqlite",
});

const Category = sequelize.define("category", {
  category_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  category_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Product = sequelize.define("product", {
  product_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  product_amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  product_price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

Category.hasMany(Product, {
  foreignKey: "category_id",
});

Product.belongsTo(Category, {
  foreignKey: "category_id",
});

sequelize.sync();

app.use(express.json());

//api
app.get("/", (req, res) => {
  res.status(200).json("Hello World!");
});

app.get("/category", (req, res) => {
  Category.findAll()
    .then((rows) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/category/:category_id", (req, res) => {
  Category.findOne({
    where: {
      category_id: req.params.category_id,
    },
  })
    .then((row) => {
      res.status(200).json(row);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.put("/category/:category_id", (req, res) => {
  Category.findByPk(req.params.category_id)
    .then((category) => {
      category
        .update(req.body)
        .then((row) => {
          res.status(200).json(row);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/category", (req, res) => {
  Category.findByPk(req.query.category_id)
    .then((category) => {
      category
        .destroy()
        .then((row) => {
          res.status(200).json(row);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

// 1 by param
// 2 by body
// 3 by query

app.post("/category", (req, res) => {
  Category.create(req.body)
    .then((row) => {
      res.status(200).json(row);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/product", (req, res) => {
  Product.findAll({
    include: [
      {
        model: Category,
        attributes: ["category_name"],
      },
    ],
  })
    .then((rows) => {
      res.status(200).json(rows);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/product/:product_id", (req, res) => {
  Product.findByPk(req.params.product_id)
    .then((product) => {
      res.status(200).json(product);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/product", (req, res) => {
  Product.create(req.body)
    .then((product) => {
      res.status(200).json(product);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.put("/product/:product_id", (req, res) => {
  Product.findByPk(req.params.product_id)
    .then((product) => {
      product
        .update(req.body)
        .then((row) => {
          res.status(200).json(row);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/product/:product_id", (req, res) => {
  Product.findByPk(req.params.product_id)
    .then((product) => {
      product
        .destroy()
        .then((row) => {
          res.status(200).json(row);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, function () {
  console.log(`server run on port ${port}`);
});
