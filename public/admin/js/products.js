const url = new URL(window.location.href);

//------------- filter products
const maintainQuery = document.querySelectorAll('form[data-maintain-query]');
maintainQuery?.forEach((form) => {
	form.addEventListener('submit', function (event) {
		event.preventDefault();

		const formData = new FormData(form);
		for (const [key, value] of formData.entries()) {
			url.searchParams.set(key, value);
		}

		window.location.href = url.toString();
	});
});

//------------- pagination
const pageLinks = document.querySelectorAll('a[data-page]');
pageLinks?.forEach((link) => {
	link.addEventListener('click', function (event) {
		event.preventDefault();
		url.searchParams.set('page', link.dataset.page);
		window.location.href = url;
	});
});

//------------- Bulk update
const productListForm = document.querySelector('form#product-list');
// update state of bulk update button
productListForm?.addEventListener('change', function (event) {
	const target = event.target;
	const formData = new FormData(productListForm);
	const checkAll = productListForm.querySelector('input[name="checkAll"]');
	const checkboxes = productListForm.querySelectorAll('input[name="_id"]');
	const bulkUpdateBtn = productListForm.querySelector(
		'button[name="bulkUpdate"]'
	);
	const action = formData.get('bulkAction');

	if (target === checkAll) {
		checkboxes.forEach((checkbox) => {
			checkbox.checked = checkAll.checked;
		});
	}

	const checkedItems = productListForm.querySelectorAll(
		'input[name="_id"]:checked'
	);

	if (target.name === '_id') {
		checkAll.checked = checkboxes.length === checkedItems.length;
	}

	bulkUpdateBtn.disabled = !(
		(checkAll.checked || checkedItems.length) &&
		action[0] != '-'
	);
});

document
	.querySelector('form#update-form')
	?.addEventListener('submit', function (event) {
		const submitter = event.submitter;
		const dataForm = submitter.closest('form');
		submitter.form = event.target;
		let ok = true;
		switch (submitter.name) {
			case 'bulkUpdate':
				ok = bulkUpdate(dataForm, submitter);
				break;
			case 'active':
			case 'inactive':
				ok = updateStatus(submitter);
				break;
			case 'delete':
				ok = deleteProduct(submitter);
				break;
			default:
				break;
		}
		if (!ok) {
			event.preventDefault();
		}
	});

function updateStatus(submitter) {
	addInput(submitter.form, [{ status: submitter.name }]);
	return true;
}

function deleteProduct(submitter) {
	if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
		addInput(submitter.form, [{ deleted: true }]);
		return true;
	}
	return false;
}

function bulkUpdate(dataForm, submitter) {
	const checkedItems = dataForm.querySelectorAll('input[name="_id"]:checked');
	const action = dataForm.querySelector('select[name="bulkAction"]').value;
	const products = Array.from(checkedItems).map((checkbox) => {
		return { _id: checkbox.value };
	});

	switch (action) {
		case 'delete':
			if (!confirm('Bạn có chắc chắn muốn xóa những sản phẩm này?')) {
				return false;
			}
			products.forEach((product) => {
				product.deleted = true;
			});
			break;
		case 'active':
		case 'inactive':
			products.forEach((product) => {
				product.status = action;
			});
			break;
		case 'position':
			products.forEach((product, i) => {
				const position = checkedItems[i]
					.closest('tr')
					.querySelector('input[name="position"]').value;
				product.position = position;
			});
			break;
		default:
			break;
	}

	addInput(submitter.form, products);
	return true;
}

function addInput(form, products) {
	products.forEach((product) => {
		for (const [name, value] of Object.entries(product)) {
			const input = document.createElement('input');
			input.type = 'hidden';
			input.name = name;
			input.value = value;
			form.appendChild(input);
		}
	});
}

//----------------- Fade out alert
const alerts = document.querySelectorAll('.alert');
alerts?.forEach((alert) => {
	setTimeout(() => {
		bootstrap.Alert.getOrCreateInstance(alert).close();
	}, 5555);
});
