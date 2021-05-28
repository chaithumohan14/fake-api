import faker from "faker";
import fs from "fs";

const data = [...Array(1000)].map((_element, index) => ({
	id: index,
	name: faker.commerce.product(),
	description: faker.commerce.productDescription(),
	price: faker.commerce.price(),
	url: faker.image.imageUrl(),
	rating: faker.datatype.number(),
}));

fs.writeFileSync("./products.json", JSON.stringify(data));
