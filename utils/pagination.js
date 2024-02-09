class Pagination {
	#showMaxPages;
	#currentPage;
	#totalItems;
	#itemPerPage;

	constructor({
		totalItems = 0,
		itemPerPage = 10,
		showMaxPages = 7,
		currentPage = 1,
	}) {
		this.totalItems = totalItems;
		this.itemPerPage = itemPerPage;
		this.showMaxPages = showMaxPages;
		this.currentPage = currentPage;
	}

	set totalItems(value) {
		if (!Number.isInteger(value) || value < 0) {
			throw new Error('Invalid total items value');
		}
		this.#totalItems = value;
	}

	set itemPerPage(value) {
		if (!Number.isInteger(value) || value < 1) {
			throw new Error('Invalid item per page value');
		}
		this.#itemPerPage = value;
	}

	get itemPerPage() {
		return this.#itemPerPage;
	}

	set showMaxPages(value) {
		if (!Number.isInteger(value) || value < 1) {
			throw new Error('Invalid maximum showed pages value');
		}
		this.#showMaxPages = value;
	}

	set currentPage(value) {
		if (!Number.isInteger(value) || value < 1) {
			value = 1;
		} else if (value > this.totalPages) {
			value = this.totalPages;
		}
		this.#currentPage = value;
	}

	get totalPages() {
		return Math.ceil(this.#totalItems / this.#itemPerPage) || 1;
	}

	get currentPage() {
		return this.#currentPage;
	}

	get skip() {
		return (this.#currentPage - 1) * this.#itemPerPage;
	}

	get showPages() {
		if (this.totalPages <= this.#showMaxPages) {
			return Array.from({ length: this.totalPages }, (_, i) => i + 1);
		}

		const pages = [this.currentPage];
		const d = Math.floor(this.#showMaxPages / 2) - 2;
		let dr = d;
		let dl = d;

		if (this.currentPage <= d + 3) {
			dr += d + 3 - this.currentPage;
		}

		if (this.currentPage >= this.totalPages - d - 2) {
			dl += this.currentPage - (this.totalPages - d - 2);
		}

		while (dl > 0 && pages[0] > 2) {
			pages.unshift(pages[0] - 1);
			dl--;
		}
		while (dr > 0 && pages[pages.length - 1] < this.totalPages) {
			pages.push(pages[pages.length - 1] + 1);
			dr--;
		}

		if (pages[0] < 4) {
			while (pages[0] - 1) {
				pages.unshift(pages[0] - 1);
			}
		} else {
			pages.unshift(1, '...');
		}

		if (pages[pages.length - 1] > this.totalPages - 3) {
			while (pages[pages.length - 1] < this.totalPages) {
				pages.push(pages[pages.length - 1] + 1);
			}
		} else {
			pages.push('...', this.totalPages);
		}

		return pages;
	}
}

module.exports = Pagination;

if (require.main === module) {
	/*
				1  *  5  6  _7_  8  9  * 20
				1  2  3  4  _5_  6  7  * 20
				1  * 14 15 _16_ 17 18 19 20
				
				d = 2
	*/
	const pagination = new Pagination({
		showMaxPages: 7,
		currentPage: 1,
		totalItems: 100,
		itemPerPage: 10,
	});

	console.log('result:', pagination.showPages);
}
