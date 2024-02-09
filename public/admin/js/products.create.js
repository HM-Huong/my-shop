const url = new URL(window.location.href);

document.querySelector('input[accept="image/*"]')?.addEventListener('change', (e) => {
	const file = e.target.files[0];
	if (file) {
		const preview = document.querySelector('img#preview');
		preview.src = URL.createObjectURL(file);
		preview.style = style="height: 200px"
	}
});