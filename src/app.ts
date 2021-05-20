import dotenv from "dotenv";
import fs from "fs";
import express, { Response } from "express";
import validator from "validator";
import jwt from "jsonwebtoken";

interface User {
	email: string;
	password: string;
	username: string;
	id: number;
}

interface Product {
	id: number;
	name: string;
	price: number;
	description: string;
	rating: number;
	url: string;
}

interface DB {
	users: Array<User>;
	products: Array<Product>;
}

dotenv.config();
const app = express();
app.use(express.json());

const SECRET = `Y?[D11>g[n'f{n5g/%O"LyeVBCp:3-4&_3mNSLb=;lyZnfN$LJ9<KrBfyxpV9]H`;

const dbFile = JSON.parse(
	fs.readFileSync("./db.json").toString()
) as Array<User>;
const productsFile = JSON.parse(
	fs.readFileSync("./products.json").toString()
) as Array<Product>;

let db: DB = {
	users: dbFile,
	products: productsFile,
};

const reWrite = () => {
	fs.writeFileSync("./db.json", JSON.stringify(db.users));
};

const loginUser = (email: string, password: string, res: Response) => {
	if (!validator.isEmail(email)) {
		res.status(403).json({ msg: "Enter a valid email" });
		return;
	}

	if (validator.isEmpty(password)) {
		res.status(403).json({ msg: "Enter a valid password" });
		return;
	}
	const dbUser = db.users.find(
		(element) => element.email === email && element.password === password
	);
	if (!dbUser) {
		res.status(403).json({ msg: "Invalid Credentials" });
		return;
	} else {
		res
			.status(200)
			.json({ ...dbUser, token: jwt.sign(dbUser.id.toString(), SECRET) });
		return;
	}
};

const registerUser = (
	email: string,
	username: string,
	password: string,
	res: Response
) => {
	if (!validator.isEmail(email)) {
		res.status(403).json({ msg: "Enter a valid email" });
		return;
	}

	if (validator.isEmpty(username)) {
		res.status(403).json({ msg: "Enter a valid username" });
		return;
	}

	if (validator.isEmpty(password)) {
		res.status(403).json({ msg: "Enter a valid password" });
		return;
	}
	const dbUser = db.users.find((element) => element.email === email);

	if (dbUser) {
		res.status(403).json({ msg: "User already exists" });
		return;
	} else {
		const newUser: User = { email, password, username, id: db.users.length };
		db.users.push(newUser);
		res.status(200).json(newUser);
	}
};

app.listen(process.env.PORT, async () => {
	console.log("> Server Started...");
});

app.post("/users", async (req, res) => {
	const { email, username, password } = req.body;
	if (req.headers["x-action"] === "login") {
		loginUser(email, password, res);
	} else if (req.headers["x-action"] === "register") {
		registerUser(email, username, password, res);
	} else {
		res.status(403).json({ msg: "Unauthorised" });
	}
});

app.put("/users/:id", (req, res) => {
	const { id } = req.params;
	const { email, username, password } = req.body;
	if (id) {
		const dbUser = db.users.find((element) => element.id.toString() === id);
		if (!dbUser) {
			res.status(400).json({ msg: "User not found" });
			return;
		} else {
			const updatedUser: User = {
				...dbUser,
				email: email || dbUser.email,
				password: password || dbUser.password,
				username: username || dbUser.username,
			};
			const index = db.users.indexOf(dbUser);
			db.users[index] = updatedUser;
			reWrite();
			res.status(200).json(db.users[index]);
		}
	} else {
		res.status(400).json({ msg: "Bad Request" });
		return;
	}
});

app.get("/users/:id", (req, res) => {
	const { id } = req.params;
	console.log(req.params);
	const dbUser = db.users.find((element) => element.id.toString() === id);
	if (!dbUser) {
		res.status(400).json({ msg: "User not found" });
	} else {
		res.status(200).json(dbUser);
	}
});

app.get("/products", (_req, res) => {
	const products = db.products;
	res.status(200).json(products);
});

app.get("/products/:id", (req, res) => {
	const { id } = req.params;
	if (id) {
		const product = db.products.find((element) => element.id.toString() === id);
		if (product) {
			res.status(200).json({ ...product, rating: product.rating / 10 });
			return;
		} else {
			res.status(400).json({ msg: "Product not found" });
			return;
		}
	} else {
		res.status(400).json({ msg: "Product not found" });
		return;
	}
});
