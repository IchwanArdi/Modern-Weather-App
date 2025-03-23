function getWeatherIcon(condition) {
  // Mapping kondisi cuaca ke icon Font Awesome
  const conditionLower = condition.toLowerCase();

  if (conditionLower.includes('hujan') || conditionLower.includes('rain')) {
    return 'fas fa-cloud-rain';
  } else if (conditionLower.includes('cerah') || conditionLower.includes('sunny')) {
    return 'fas fa-sun';
  } else if (conditionLower.includes('berawan') || conditionLower.includes('cloud')) {
    return 'fas fa-cloud';
  } else if (conditionLower.includes('kabut') || conditionLower.includes('fog') || conditionLower.includes('mist')) {
    return 'fas fa-smog';
  } else if (conditionLower.includes('salju') || conditionLower.includes('snow')) {
    return 'fas fa-snowflake';
  } else if (conditionLower.includes('badai') || conditionLower.includes('storm') || conditionLower.includes('thunder')) {
    return 'fas fa-bolt';
  } else {
    return 'fas fa-cloud-sun';
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString('id-ID', options);
}

function weather(city = 'jakarta') {
  $('#main').html(`
  <div class="loading fade-in">
    <i class="fas fa-sync-alt"></i>
    <p>Memuat data cuaca...</p>
  </div>
`);

  $.ajax({
    url: 'https://api.weatherapi.com/v1/current.json',
    type: 'get',
    dataType: 'json',
    data: {
      key: '2bb04ad82d324a8d9f6143655252303',
      q: city,
      aqi: 'yes',
    },
    success: function (res) {
      const { location, current } = res;
      const weatherIcon = getWeatherIcon(current.condition.text);
      const formattedDate = formatDate(current.last_updated);

      $('#main').html(`
      <div class="search-box fade-in">
        <input type="text" id="search-input" placeholder="Cari kota..." value="${location.name}">
        <button id="search-btn"><i class="fas fa-search"></i></button>
      </div>
      <div class="weather-card fade-in">
        <div class="location">
          <i class="fas fa-map-marker-alt"></i>
          <div class="city">${location.name}, ${location.country}</div>
        </div>
        <div class="date">${formattedDate}</div>
        
        <div class="weather-icon">
          <i class="${weatherIcon}"></i>
        </div>
        
        <div class="temp">${current.temp_c}°C</div>
        <div class="condition">${current.condition.text}</div>
        
        <div class="details">
          <div class="col">
            <i class="fas fa-thermometer-half"></i>
            <div class="label">Terasa Seperti</div>
            <div class="value">${current.feelslike_c}°C</div>
          </div>
          
          <div class="col">
            <i class="fas fa-tint"></i>
            <div class="label">Kelembaban</div>
            <div class="value">${current.humidity}%</div>
          </div>
          
          <div class="col">
            <i class="fas fa-wind"></i>
            <div class="label">Angin</div>
            <div class="value">${current.wind_kph} km/j</div>
          </div>
          
          <div class="col">
            <i class="fas fa-compress-arrows-alt"></i>
            <div class="label">Tekanan</div>
            <div class="value">${current.pressure_mb} mb</div>
          </div>
        </div>
      </div>
    `);

      // Event listener baru setelah render ulang
      $('#search-btn').on('click', function () {
        weather($('#search-input').val());
      });

      $('#search-input').on('keyup', function (e) {
        if (e.keyCode === 13) weather($(this).val());
      });

      // Animasi tambahan saat data berhasil dimuat
      $('.weather-card').css('opacity', 0).animate(
        {
          opacity: 1,
        },
        500
      );
    },
    error: function (xhr, status, error) {
      console.error('Error:', xhr.status, xhr.responseText);

      let errorMessage = 'Gagal mengambil data cuaca!';
      let errorIcon = 'fas fa-exclamation-circle';

      if (xhr.status === 401) {
        errorMessage = 'API Key salah atau tidak valid!';
      } else if (xhr.status === 403) {
        errorMessage = 'Akses dilarang! Cek API key atau izin akses.';
      } else if (xhr.status === 404) {
        errorMessage = 'Kota tidak ditemukan!';
        errorIcon = 'fas fa-map-marker-alt';
      } else if (xhr.status === 429) {
        errorMessage = 'Terlalu banyak permintaan! Coba lagi nanti.';
        errorIcon = 'fas fa-clock';
      }

      $('#main').html(`
      <div class="search-box fade-in">
        <input type="text" id="search-input" placeholder="Cari kota...">
        <button id="search-btn"><i class="fas fa-search"></i></button>
      </div>
      <div class="error fade-in">
        <i class="${errorIcon}"></i>
        <p>${errorMessage}</p>
      </div>
    `);

      // Event listener baru setelah render ulang
      $('#search-btn').on('click', function () {
        weather($('#search-input').val());
      });

      $('#search-input').on('keyup', function (e) {
        if (e.keyCode === 13) weather($(this).val());
      });
    },
  });
}

// Jalankan aplikasi
$(document).ready(function () {
  weather();
});
