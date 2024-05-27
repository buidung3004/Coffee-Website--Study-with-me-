(function ($) {
    "use strict";
    
    const $window = $(window),
        $body = $('body')

    /* Header Sticky */
    function headerSticky() {
        if ($window.scrollTop() > 350) {
            $('.sticky-header').addClass('is-sticky');
        } else {
            $('.sticky-header').removeClass('is-sticky');
        }
    }

    /* Mobile Sub Menu Toggle Function */
    const $mobileSubMenuToggle = $('.mobile-sub-menu-toggle')
    $mobileSubMenuToggle.on('click', function() {
        const $this = $(this),
            $mobileSubMenuToggleClass = '.mobile-sub-menu-toggle',
            $mobileSubMenuClass = '.mobile-sub-menu';
        if($this.hasClass('active')) {
            $this.removeClass('active').closest('li').removeClass('active').find($mobileSubMenuToggleClass).removeClass('active').closest('li').removeClass('active').find($mobileSubMenuClass).slideUp()
        } else {
            $this.addClass('active').siblings($mobileSubMenuClass).slideDown()
            $this.closest('li').addClass('active').siblings().find($mobileSubMenuToggleClass).removeClass('active').closest('li').removeClass('active').find($mobileSubMenuClass).slideUp()
        }
    })


    /* Swiper Slider */
    /* Hero Slider */
    const heroSlider = new Swiper('.hero-slider', {
        loop: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        pagination: {
            el: '.hero-slider .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.hero-slider .swiper-button-next',
            prevEl: '.hero-slider .swiper-button-prev',
        }
    });
    /* Product Carousel */
    const productCarousel = new Swiper('.product-carousel', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 15,
        pagination: {
            el: '.product-carousel .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.product-carousel .swiper-button-next',
            prevEl: '.product-carousel .swiper-button-prev',
        },
        breakpoints: {
            576: {
                slidesPerView: 2
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 30
            },
            1200: {
                slidesPerView: 4,
                spaceBetween: 30
            }
        }
    });
    /* Deal Product Carousel */
    const dealProductCarousel = new Swiper('.deal-product-carousel', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 15,
        pagination: {
            el: '.deal-product-carousel .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.deal-product-carousel .swiper-button-next',
            prevEl: '.deal-product-carousel .swiper-button-prev',
        },
        breakpoints: {
            576: {
                slidesPerView: 2
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        }
    });
    /* Group Product Carousel */
    $('.group-product-slider').each(function(){
        const groupProductCarousel = new Swiper($(this)[0], {
            slidesPerView: 1,
            grid: {
                fill: 'row',
                rows: 4,
            },
            spaceBetween: 20,
            pagination: {
                el: '.group-product-slider .swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: `#${$(this).data('nav-target')} .swiper-button-next`,
                prevEl: `#${$(this).data('nav-target')} .swiper-button-prev`,
            }
        });
    });
    /* Single Product Thumbnail Carousel */
    const productThumbCarousel = new Swiper('.product-thumb-carousel', {
        slidesPerView: 4,
        spaceBetween: 10,
        pagination: {
            el: '.product-thumb-carousel .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.product-thumb-carousel .swiper-button-next',
            prevEl: '.product-thumb-carousel .swiper-button-prev',
        }
    });
    /* Single Product Image Slider */
    const productImageSlider = new Swiper('.product-image-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
            el: '.product-image-slider .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.product-image-slider .swiper-button-next',
            prevEl: '.product-image-slider .swiper-button-prev',
        },
        thumbs: {
            swiper: productThumbCarousel,
        },
    });
    /* Single Product Thumbnail Carousel Vertical */
    const productThumbCarouselVertical = new Swiper('.product-thumb-carousel-vertical', {
        direction: 'vertical',
        slidesPerView: 4,
        spaceBetween: 10,
        pagination: {
            el: '.product-thumb-carousel-vertical .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.product-thumb-carousel-vertical .swiper-button-next',
            prevEl: '.product-thumb-carousel-vertical .swiper-button-prev',
        }
    });
    /* Single Product Image Slider Vertical */
    const productImageSliderVertical = new Swiper('.product-image-slider-vertical', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
            el: '.product-image-slider-vertical .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.product-image-slider-vertical .swiper-button-next',
            prevEl: '.product-image-slider-vertical .swiper-button-prev',
        },
        thumbs: {
            swiper: productThumbCarouselVertical,
        },
    });
    /* Quickview Product Thumbnail Carousel */
    const quickviewProductThumbCarousel = new Swiper('.quickview-product-thumb-carousel', {
        slidesPerView: 4,
        spaceBetween: 10,
        pagination: {
            el: '.quickview-product-thumb-carousel .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.quickview-product-thumb-carousel .swiper-button-next',
            prevEl: '.quickview-product-thumb-carousel .swiper-button-prev',
        }
    });
    /* Quickview Product Image Slider */
    const quickviewProductImageSlider = new Swiper('.quickview-product-image-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
            el: '.quickview-product-image-slider .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.quickview-product-image-slider .swiper-button-next',
            prevEl: '.quickview-product-image-slider .swiper-button-prev',
        },
        thumbs: {
            swiper: quickviewProductThumbCarousel,
        },
    });
    /* Testimonial */
    const testimonialSlider = new Swiper('.testimonial-slider', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 60,
        pagination: {
            el: '.testimonial-slider .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.testimonial-slider .swiper-button-next',
            prevEl: '.testimonial-slider .swiper-button-prev',
        }
    });
    /* Blog Carousel */
    const blogCarousel = new Swiper('.blog-carousel', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 15,
        pagination: {
            el: '.blog-carousel .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.blog-carousel .swiper-button-next',
            prevEl: '.blog-carousel .swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        }
    });
    /* Team Carousel */
    const teamCarousel = new Swiper('.team-carousel', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 15,
        pagination: {
            el: '.team-carousel .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.team-carousel .swiper-button-next',
            prevEl: '.team-carousel .swiper-button-prev',
        },
        breakpoints: {
            480: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 30
            },
            1200: {
                slidesPerView: 4,
                spaceBetween: 30
            }
        }
    });

    /* Magnific Popup */
    $('.mfp-zoom-gallery').magnificPopup({
		delegate: 'a',
		type: 'image',
		gallery: {
			enabled: true
		}
	});

    /* Countdown */
    $('[data-countdown]').each(function() {
        var $this = $(this),
        $finalDate = $(this).data('countdown'),
        $template = `<div class="countdown-item"><span class="number">%D</span><span class="label">Days</span></div><div class="countdown-item"><span class="number">%H</span><span class="label">Hours</span></div><div class="countdown-item"><span class="number">%M</span><span class="label">Min</span></div><div class="countdown-item"><span class="number">%S</span><span class="label">Sec</span></div>`;
        $this.countdown($finalDate, function(e) {
            $this.html(e.strftime($template));
        });
    });

    /* Price Range */
    if($('#price-range')) {
        $('#price-range').ionRangeSlider({
            type: "double",
            min: 0,
            max: 2000,
            from: 200,
            to: 1000,
            prefix: "$"
        });
    }

    /* Image Zoom */
    function imageZoom () {
        const $elem = $('.image-zoom'),
            $zoomImage = $('.image-zoom .zoomImg');
        if($window.outerWidth() < 992) {
            if($zoomImage.length !== 0) {
                $elem.trigger('zoom.destroy');
            }
        } else {
            if($zoomImage.length === 0) {
                $elem.zoom();
            }
        }
    }
    imageZoom()

    $('.sidebar').stickySidebar({
        topSpacing: 100,
        bottomSpacing: 60
    });
    
    // /* Product Quantity */
    // $('.product-quantity-count').on('click', '.qty-btn', function(e) {
    //     e.preventDefault()
    //     const $btn = $(this),
    //         $box = $btn.siblings('.product-quantity-box')[0];
    //     if($btn.hasClass('inc')) {
    //         $box.value = Number($box.value) + 1
    //     } else if($btn.hasClass('dec') && Number($box.value) > 1) {
    //         $box.value = Number($box.value) - 1
    //     }
    // })

    /* Shipping Form Toggle */
    if($('[data-toggle-shipping]').length) {
        const $shippingToggle = $('[data-toggle-shipping]'),
            $shippingToggleTarget = $($shippingToggle[0].dataset.toggleShipping),
            $shippingShowHide = function() {
                if( $shippingToggle[0].checked ) {
                    $shippingToggleTarget.slideDown();
                } else {
                    $shippingToggleTarget.slideUp();
                }
            }
        $shippingShowHide()
        $shippingToggle.on('change', function(){$shippingShowHide()});
    }

    /* Payment Method Toggle */
    if($('input[type="radio"][name="payment-method"]').length) {
        const $paymentToggle = $('input[type="radio"][name="payment-method"]'),
            $paymentShowHide = function() {
                $paymentToggle.each(function() {
                    const $this = $(this),
                        $thisContent = $this.siblings('p')
                    if( $this[0].checked ) {
                        $thisContent.slideDown();
                        $this.parent().siblings().find('p').slideUp()
                    }
                })
            }
        $paymentShowHide()
        $paymentToggle.on('change', function(){$paymentShowHide()});
    }

    /*--
        Ajax Contact Form
    -----------------------------------*/
    $(function () {
        // Get the form.
        var form = $('#contact-form');
        // Get the messages div.
        var formMessages = $('.form-messege');
        // Set up an event listener for the contact form.
        $(form).submit(function (e) {
            // Stop the browser from submitting the form.
            e.preventDefault();
            // Serialize the form data.
            var formData = $(form).serialize();
            // Submit the form using AJAX.
            $.ajax({
                    type: 'POST',
                    url: $(form).attr('action'),
                    data: formData
                })
                .done(function (response) {
                    // Make sure that the formMessages div has the 'success' class.
                    formMessages.removeClass('error text-danger').addClass('success text-success learts-mt-10').text(response);
                    // Clear the form.
                    form.find('input:not([type="submit"]), textarea').val('');
                })
                .fail(function (data) {
                    // Make sure that the formMessages div has the 'error' class.
                    formMessages.removeClass('success text-success').addClass('error text-danger mt-3');
                    // Set the message text.
                    if (data.responseText !== '') {
                        formMessages.text(data.responseText);
                    } else {
                        formMessages.text('Oops! An error occured and your message could not be sent.');
                    }
                });
        });
    });

    /* Scroll To Top */
    const scrollToTopBtn = $('.scroll-to-top');
    scrollToTopBtn.on('click', function() {
        $("html, body").animate({ scrollTop: 0 });
        return false;
    })
    function scrollToTopShow() {
        if ($window.scrollTop() > $window[0].outerHeight) {
            scrollToTopBtn.addClass('show');
        } else {
            scrollToTopBtn.removeClass('show');
        }
    }

    /* Resize Event */
    $window.on('resize', function() {
        imageZoom()
    })
    /* Scroll Event */
    $window.on('scroll', function () {
        headerSticky()
        scrollToTopShow()
    });

})(jQuery);	

// Pagination
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    let currentPage = parseInt(urlParams.get('page')) || 1;

    function updatePage(newPage) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('page', newPage);
        window.location.href = newUrl.toString();
    }

    document.querySelectorAll('.pagination a').forEach(function(pageLink) {
        pageLink.addEventListener('click', function(event) {
            event.preventDefault();
            const pageHref = pageLink.getAttribute('href');
            const pageMatch = pageHref.match(/#page=(\d+)/);
            if (pageMatch) {
                const newPage = parseInt(pageMatch[1]);
                if (!isNaN(newPage)) {
                    updatePage(newPage);
                }
            }
        });
    });

    function updateActivePage() {
        document.querySelectorAll('.pagination li').forEach(function(pageItem) {
            const pageLink = pageItem.querySelector('a');
            if (pageLink) {
                const pageHref = pageLink.getAttribute('href');
                const pageMatch = pageHref.match(/#page=(\d+)/);
                if (pageMatch) {
                    const page = parseInt(pageMatch[1]);
                    if (page === currentPage) {
                        pageItem.classList.add('active');
                    } else {
                        pageItem.classList.remove('active');
                    }
                }
            }
        });
    }

    updateActivePage();
});


document.addEventListener('DOMContentLoaded', () => {
    const inputsQuantity = document.querySelectorAll("input[name='quantity']");
    const buttonsDec = document.querySelectorAll(".dec.qty-btn");
    const buttonsInc = document.querySelectorAll(".inc.qty-btn");

    if (inputsQuantity.length > 0) {
        inputsQuantity.forEach(input => {
            input.addEventListener("change", (e) => {
                const productId = input.getAttribute("product-id");
                const quantity = parseInt(input.value);
                if (quantity > 0) {
                    window.location.href = `/cart/update/${productId}/${quantity}`;
                }
            });
        });
    }

    if (buttonsDec.length > 0) {
        buttonsDec.forEach(button => {
            button.addEventListener("click", (e) => {
                const productId = button.getAttribute("data-product-id");
                const input = document.querySelector(`input[product-id='${productId}']`);
                let quantity = parseInt(input.value);
                if (quantity > 1) {
                    quantity -= 1;
                    input.value = quantity;
                    window.location.href = `/cart/update/${productId}/${quantity}`;
                }
            });
        });
    }

    if (buttonsInc.length > 0) {
        buttonsInc.forEach(button => {
            button.addEventListener("click", (e) => {
                const productId = button.getAttribute("data-product-id");
                const input = document.querySelector(`input[product-id='${productId}']`);
                let quantity = parseInt(input.value);
                quantity += 1;
                input.value = quantity;
                window.location.href = `/cart/update/${productId}/${quantity}`;
            });
        });
    }
});


// Show Alert

const showAlert = document.querySelector("[show-alert]")

if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"))
    const closeAlert = showAlert.querySelector("[close-alert]")
    setTimeout(() => {
        showAlert.classList.add("alert-hidden")
    },time)
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    })
}

// Sort
const sortWrapper = document.querySelector(".filter-bar");

if (sortWrapper) {
  let url = new URL(window.location.href);

  const sortSelect = sortWrapper.querySelector("[sort-select]");
  const sortClear = sortWrapper.querySelector("[sort-clear]");

  // Sort-Select
  sortSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    const [sortKey, sortValue] = value.split("-");

    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);

    window.location.href = url.href;
  });

  // Sort-Clear
  sortClear.addEventListener("click", () => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");

    window.location.href = url.href;
  });

  // Add selected option
  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");
  if (sortKey && sortValue) {
    const stringSort = `${sortKey}-${sortValue}`;
    console.log(stringSort);
    const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);
    if (optionSelected) {
      optionSelected.selected = true;
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
    // Select the quantity buttons
    const qtyButtons = document.querySelectorAll('.qty-btn');
    const addToCartButton = document.querySelector('#add-to-cart');

    qtyButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            // Prevent default behavior
            event.preventDefault();
            // Prevent the event from bubbling up
            event.stopPropagation();
            
            // Handle the quantity change logic here
            const input = this.parentElement.querySelector('.product-quantity-box');
            let currentValue = parseInt(input.value);
            if (isNaN(currentValue)) currentValue = 1;

            if (this.classList.contains('dec')) {
                input.value = currentValue > 1 ? currentValue - 1 : 1;
            } else if (this.classList.contains('inc')) {
                input.value = currentValue + 1;
            }
        });
    });

    addToCartButton.addEventListener('click', function(event) {
        // Handle the add to cart logic here
        const quantity = document.querySelector('.product-quantity-box').value;
        console.log('Adding to cart:', quantity);
        // Perform the add to cart action
    });
});


function updateTotalPrice(shippingFee, method) {
    var cartTotal = cartDetail.totalPrice; // Ensure this is a number
    var totalPrice = cartTotal + shippingFee;
    
    document.getElementById('totalPriceDisplay').innerText = `Total Price: ${totalPrice} VND`;
    document.getElementById('cartTotalPrice').innerText = `${totalPrice} VND`;
    document.getElementById('selectedDeliveryMethod').innerText = method;
    document.getElementById('selectedDeliveryFee').innerText = `${shippingFee} VND`;
  }
  
  document.getElementById('deliveryMethodFast').addEventListener('change', function() {
    updateTotalPrice(30000, 'Fast');
  });
  
  document.getElementById('deliveryMethodEconomical').addEventListener('change', function() {
    updateTotalPrice(15000, 'Economical');
  });
  