const setBackgroundElement = () => {
	$("[setBackground]").each(function () {
		let background = $(this).attr("setBackground");
		$(this).css({
			"background-image": "url(" + background + ")",
			"background-size": "cover",
			"background-position": "center center",
		});
	});
	$("[setBackgroundRepeat]").each(function () {
		let background = $(this).attr("setBackgroundRepeat");
		$(this).css({
			"background-image": "url(" + background + ")",
			"background-repeat": "repeat",
		});
	});
};
const reveal = () => {
	var reveals = document.querySelectorAll(".reveal");
	for (var i = 0; i < reveals.length; i++) {
		var windowHeight = window.innerHeight;
		var elementTop = reveals[i].getBoundingClientRect().top;
		var elementVisible = 150;
		if (elementTop < windowHeight - elementVisible) {
			reveals[i].classList.add("active");
		} else {
			reveals[i].classList.remove("active");
		}
	}
}
window.addEventListener("scroll", reveal);

window.onload = function () {
	setBackgroundElement();
	var msie = document.documentMode;
	if (msie) {
		alert('IE');
	}
	
};
