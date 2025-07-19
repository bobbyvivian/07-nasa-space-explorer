// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
// button to fetch images
const getImagesButton = document.querySelector('.filters button');
// gallery element to display images
const gallery = document.getElementById('gallery');

// my API key for NASA's APOD API
const API_KEY = 'tD71R4JpzymEokn9cwfL520NfecF8rwwUaKuVXtQ';

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

getImagesButton.addEventListener('click', () => {
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Check if both dates are selected
  if (!startDate || !endDate) {
    alert('Please select both a start and end date.');
    return;
  }

  // Show a loading message before fetching data
  gallery.innerHTML = '<div class="placeholder"><div class="placeholder-icon">🔄</div><p>Loading space photos…</p></div>';

   // Build the API URL with the selected dates
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  // Fetch data from NASA's APOD API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Clear the gallery
      gallery.innerHTML = '';

      // Check if data is an array (multiple images)
      if (Array.isArray(data)) {
        // Loop through each image and add to the gallery
        data.forEach(item => {
          // Only show images (not videos)
          if (item.media_type === 'image') {
            // Create a div for each gallery item
            const itemDiv = document.createElement('div');
            itemDiv.className = 'gallery-item';

            // Add the image
            const img = document.createElement('img');
            img.src = item.url;
            img.alt = item.title;
            // Add the title and date
            const title = document.createElement('h3');
            title.textContent = item.title;

            const date = document.createElement('p');
            date.textContent = item.date;

            // Add everything to the item div
            itemDiv.appendChild(img);
            itemDiv.appendChild(title);
            itemDiv.appendChild(date);
            img.addEventListener('click', () => {
                showModal(item);
            });

            // Add the item to the gallery
            gallery.appendChild(itemDiv);
          }
        });
      } else {
        // If only one image is returned (not an array)
        if (data.media_type === 'image') {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'gallery-item';
          const img = document.createElement('img');
          img.src = data.url;
          img.alt = data.title;

          const title = document.createElement('h3');
          title.textContent = data.title;

          const date = document.createElement('p');
          date.textContent = data.date;

          itemDiv.appendChild(img);
          itemDiv.appendChild(title);
          itemDiv.appendChild(date);
          // When the image is clicked, show the modal
          img.addEventListener('click', () => {
            showModal(item);
          });
          gallery.appendChild(itemDiv);
        }
      }
    })
    .catch(error => {
      // Show an error message if something goes wrong
      gallery.innerHTML = '<p>Sorry, something went wrong. Please try again.</p>';
      console.error(error);
    });

    // Get modal elements
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const closeModal = document.getElementById('closeModal');

    // Function to show the modal with image info
    function showModal(item) {
      modalImg.src = item.url;
      modalImg.alt = item.title;
      modalTitle.textContent = item.title;
      modalDesc.textContent = item.explanation;
      modal.style.display = 'flex';
    }
    // Close modal when X is clicked
    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // Also close modal when clicking outside the modal content
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
});
