var summ_page_item = 0;
var summ_bucket_item = 0;
var goods = [];
class ProductList {
	constructor(container = '.products') {
		this.container = container;
		this.goods = [];
		this._fetchProducts();
		this.render();
	}

	_fetchProducts() {
		this.goods = [
			{ id: 1, title: 'Notebook', catalog_img: 'notebook.jpg', price: 2000 },
			{ id: 2, title: 'Mouse', catalog_img: 'mouse.jpg', price: 20 },
			{ id: 3, title: 'Keyboard', catalog_img: 'keyboard.jpg', price: 200 },
			{ id: 4, title: 'Gamepad', catalog_img: 'gamepad.jpg', price: 50 },
		];
	}

	render() {
		const block = document.querySelector(this.container);
		for (let product of this.goods) {
			const item = new ProductItem(product);
			console.log(item);
			block.insertAdjacentHTML("beforeend", item.renderPage());
		}
	}
}

class ProductItem {
	constructor(product, img = 'img', container = '.bucket') {
		this.title = product.title;
		this.id = product.id;
		this.price = product.price;
		this.img = img;
		this.catalog_img = product.catalog_img;
		this.container = document.querySelector(container);
	}

	renderPage() {
		return `<div class="product-item">
            <h3 class = "title">${this.title}</h3>
            <img src="${this.img}/${this.catalog_img}" alt="img_${this.id}" style="width: 190px; height: 140px;">
            <p class = "price">${this.price}</p>
            <button id="${this.id - 1}" class="buy-btn">Купить</button>
            </div>`
	}
}

class GoodsList {
	constructor(price, count, id, page_summ = '.count-title', bucket_summ = '.summ_price') {
		this.price = price;
		this.count = count;
		this.id = id;
		this.priseSumm = 1;
		this.countSumm = 1;
		this.objPageSumm = document.querySelector(page_summ);
		this.objBucketSumm = document.querySelector(bucket_summ);
		this.count = 1;
	}

	summItem() {
		this.countSumm++;
		summ_page_item++;
		this.priseSumm = this.price * this.countSumm;
		document.querySelector(`[id="${this.id}-price"]`).innerHTML = `${this.countSumm}шт. ${this.priseSumm} $`;
	}

	deleteItem() {
		this.countSumm--;
		summ_page_item--;
		this.priseSumm = this.price * this.countSumm;
		document.querySelector(`[id="${this.id}-price"]`).innerHTML = `${this.countSumm}шт. ${this.priseSumm} $`;
	}

	finishSummPage() {
		this.objPageSumm.innerHTML = summ_page_item;
	}

	finishSumm() {
		summ_bucket_item += this.price;
		this.objBucketSumm.innerHTML = `${summ_bucket_item} $`;
	}

	finishDelete() {
		summ_bucket_item -= this.price;
		this.objBucketSumm.innerHTML = `${summ_bucket_item} $`;
	}
}

class BucketItem extends ProductItem {
	constructor(product, img = 'img', container = `.bucket`, container_summ = '.count-title') {
		super(product, img, container);

		this.id = this.id - 1;
		this.objPageSumm = document.querySelector(container_summ);
		this.count = 1;
	}

	renderBucket() {
		return `<div id="${this.id}-box" class="bucket-item">
            <div>
            <h3 class = "title">${this.title}</h3>
            <img src="${this.img}/${this.catalog_img}" alt="img_${this.id}" style="width: 100px; height: 70px;">
            </div>
            <div id="${this.id}-price" class = "price">
            <p>${this.count}шт. ${this.price} $</p>
            </div>
            <div class = "count-item">
            <button id="${this.id}-add" class="count-add">+</button>
            <button id="${this.id}-delete" class="count-delete">-</button>
            </div>
         </div>`
	}

	static getIDEvent(object) {
		let number_item = object.currentTarget.getAttribute('id');
		number_item = number_item.split('');
		number_item = number_item.find(item => String(parseInt(item, 10)) === String(item));
		return number_item;
	}

	static getIDObject(object) {
		let number_item = object.getAttribute('id');
		number_item = number_item.split('');
		number_item = number_item.find(item => String(parseInt(item, 10)) === String(item));
		return number_item;
	}

	addItems() {
		this.container.insertAdjacentHTML("beforeend", this.renderBucket());
		goods[this.id] = new GoodsList(this.price, this.count, this.id);
		summ_page_item++;
	}

	addButton() {
		document.querySelectorAll('.count-add').forEach((item) => {
			item.addEventListener('click', event => {
				event.preventDefault();
				const num_obj = BucketItem.getIDEvent(event);
				// const bucket_item = new BucketItem(list.goods[BucketItem.getIDEvent(event)]);
				goods[num_obj].summItem();
				goods[num_obj].finishSumm();
				goods[num_obj].finishSummPage();
			});
		});
	}

	deleteButton() {
		document.querySelectorAll('.count-delete').forEach((item) => {
			item.addEventListener('click', event => {
				event.preventDefault();
				const num_obj = Number(BucketItem.getIDEvent(event));

				// const bucket_item = new BucketItem(list.goods[BucketItem.getIDEvent(event)]);
				goods[num_obj].deleteItem();
				goods[num_obj].finishDelete();
				goods[num_obj].finishSummPage();

				if (goods[num_obj].countSumm == 0) {
					goods[num_obj] = 0;

					if (this.container.hasChildNodes()) {           //Не пуст ли объект, есть ли у него дети
						var children = this.container.childNodes;
						children.forEach(box => {
							if (BucketItem.getIDObject(box) == this.id) {
								box.remove();
							}
						})
					}
				}
			});
		});
	}
}

let list = new ProductList();

document.querySelectorAll('.buy-btn').forEach((item) => {
	item.addEventListener('click', event => {

		const number_item = event.currentTarget.getAttribute('id');
		const bucket_item = new BucketItem(list.goods[number_item]);

		if ((goods[number_item] === undefined) ||
			(goods[number_item] == 0)) {
			bucket_item.addItems();

		}
		else {
			goods[number_item].summItem();
		}

		bucket_item.addButton();
		bucket_item.deleteButton();
		goods[number_item].finishSumm();
		goods[number_item].finishSummPage();
	});
});