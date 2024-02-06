// THEME MODE CHANGER FUNCTION
const lightLogo = document.getElementById('light-logo');
const darkLogo = document.getElementById('dark-logo');
const bgDarkMode = document.getElementById('themeModeToggleDark');
const bgLightMode = document.getElementById('themeModeToggleLight');

// Retrieve saved theme from localStorage on page load
const storedTheme = localStorage.getItem('theme');
if (storedTheme) {
  document.body.dataset.bsTheme = storedTheme;
  updateButtonVisibility(); // Update button visibility based on saved theme
}

bgDarkMode.addEventListener('click', function () {
  document.body.dataset.bsTheme = 'dark';
  lightLogo.style.display = 'block';
  darkLogo.style.display = 'none';
  localStorage.setItem('theme', 'dark'); // Store theme in localStorage
  updateButtonVisibility();
});

bgLightMode.addEventListener('click', function () {
  document.body.dataset.bsTheme = 'light';
  lightLogo.style.display = 'none';
  darkLogo.style.display = 'block';
  localStorage.setItem('theme', 'light'); // Store theme in localStorage
  updateButtonVisibility();
});

function updateButtonVisibility() {
  var hiddenInput = document.getElementById("currentThemeMode");

  if (document.body.dataset.bsTheme === 'dark') {

    bgDarkMode.style.display = 'none';
    bgLightMode.style.display = 'block';
    darkLogo.style.display = 'none';
    lightLogo.style.display = 'block';
    hiddenInput.value = 'dark';
  } else {
    bgDarkMode.style.display = 'block';
    bgLightMode.style.display = 'none';
    lightLogo.style.display = 'none';
    darkLogo.style.display = 'block';
    hiddenInput.value = 'light';
  }
}
updateButtonVisibility();

// TOAST MESSAGE FUNCTION
function displaymessage(message, type) {
  const toastContainer = document.getElementById('centerToast');
  const toastBody = toastContainer.querySelector('.toast-body');
  const toast = toastContainer.querySelector('.toast');

  // Set message and type
  toastBody.textContent = message;
  toast.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info');
  toast.classList.add(`bg-${type}`);

  // Set SVG icon based on type
  let svgIcon = '';
  switch (type) {
    case 'success':
      svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-check" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"/> <circle cx="12" cy="12" r="9" /> <path d="M9 12l2 2l4 -4" /> </svg>';
      break;
    case 'danger':
      svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"/> <circle cx="12" cy="12" r="9" /> <path d="M10 10l4 4m0 -4l-4 4" /> </svg>';
      break;
    case 'warning':
      svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-exclamation" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"/> <circle cx="12" cy="12" r="9" /> <line x1="12" y1="8" x2="12" y2="12" /> <line x1="12" y1="16" x2="12.01" y2="16" /> </svg>';
      toastBody.classList.remove('text-white');
      toastBody.classList.add('text-black');
      break;
    case 'info':
      svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-info-circle" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"/> <circle cx="12" cy="12" r="9" /> <line x1="12" y1="8" x2="12" y2="12" /> <line x1="12" y1="16" x2="12.01" y2="16" /> </svg>';
      toastBody.classList.remove('text-white');
      toastBody.classList.add('text-black');
      break;
    default:
      svgIcon = '';
  }
  toastBody.insertAdjacentHTML('afterbegin',`<span class="icon me-2">${svgIcon}</span>`);

  // Show the toast
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();

  setTimeout(function () {
    bsToast.hide();
    if (toastBody.firstChild instanceof Node) {
      toastBody.removeChild(toastBody.firstChild);
    }
  }, 3050);
}

// TO GET THE RECENTLY VISITED LINKS DATA
const visitedPages = [];
const currentPageTitle = $('h1.page-title').text();
const currentPageURL = window.location.href;
// Store current page title and URL in an object
const currentPage = { title: currentPageTitle, url: currentPageURL };
visitedPages.push(currentPage);

$.ajax({
    method: 'POST',
    url: '/store_visited_pages',
    data: { visitedPages },
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    // success: function(response) {
    //     console.log(response);
    // },
    // error: function(error) {
    //     console.error(error);
    // }
});

// SEARCH BOX FUNCTIONALITY
document.addEventListener("DOMContentLoaded", initializeAwesomplete);
function initializeAwesomplete() {
  var searchBoxes = document.querySelectorAll('.search-box');
  searchBoxes.forEach(function(searchBox) {
    var awesomplete = new Awesomplete(searchBox, {
        minChars: 1,
      });

  // Set data source
  var searchToolUls = document.querySelectorAll('.search_tool_ul');
  var searchData = new Set(); // Use Set to ensure uniqueness

  searchToolUls.forEach(function (ul) {
    var toolLinks = ul.querySelectorAll('li a');
    toolLinks.forEach(function (link) {
        var linkText = link.textContent.trim();
        var href = link.getAttribute('href').replace(/ /g, '-');
        // Check for duplicates based on both label and value
        var duplicate = Array.from(searchData).some(function (item) {
            return item.label === linkText && item.value === href;
        });

        if (!duplicate) {
            searchData.add({ label: linkText, value: href });
        }
      });
  });
    // Convert Set back to array for Awesomplete
    awesomplete.list = Array.from(searchData);
    // Handle selection event
    searchBox.addEventListener("awesomplete-selectcomplete", function (event) {
      var selectedValue = event.text.value; // Get the selected value
      window.location.href = selectedValue; // Navigate to the selected link
    });
  });
}
