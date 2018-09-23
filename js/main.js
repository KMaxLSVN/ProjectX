$(function () {
//=======Getting COMPANY data=======
    $.ajax({
        type: "GET",
        url: "http://codeit.pro/codeitCandidates/serverFrontendTest/company/getList",
        success: function(msg){
            console.log(msg);
            $('.company-data .loader').hide();
    //-----Rendering-----
            $('.company__total span').text(msg.list.length);

            renderList(msg.list, '.all-company-list', (elem, data)=>{
                elem.data({partners: data.partners});
            }, {property: 'name'});
        //-----Initialization  data chart-----
            initChart(countryData(msg.list));
        }
    });
//=======Getting NEWS data=======
    $.ajax({
        type: "GET",
        url: "http://codeit.pro/codeitCandidates/serverFrontendTest/news/getList",
        success: function(msg){
            console.log(msg);
            $('.news-data .loader').hide();
    //-----Rendering-----
            function renderListNews() {
                let listIndicator = '';
                let sliderItem = '';
                for (let i=0; i < msg.list.length; i++){
                    listIndicator += `<li data-target="#carouselExampleIndicators" data-slide-to="${i}" class="carousel-indicators__point"></li>`;
                    sliderItem += `<div class="carousel-item">
                                    <div class="container">
                                        <div class="row">
                                            <div class="col-md-5">
                                                <div class="dataImg"><img src="${msg.list[i].img}"></div>
                                            </div>
                                            <div class="col-md-7">
                                                <div class="title font-weight-bold">Title</div>
                                                <div class="text">${formatText(msg.list[i].description)}</div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="font-weight-bold">Author:</div>
                                            <div class="author-data">${msg.list[i].author}</div>
                                        </div>
                                        <div class="row">
                                            <div class="font-weight-bold">Public:</div>
                                            <div>${formatDate(+msg.list[i].date)}</div>
                                        </div>
                                    </div>
                                </div>`;
                }
                $('.carousel-indicators').html(listIndicator);
                $('.carousel-inner').html(sliderItem);
                $('.carousel-indicators li:first-child, .carousel-inner .carousel-item:first-child').addClass('active');
                initSlider();
            }
            renderListNews();

        }
    });
//-----Company partners-----
    $('.company-data .company__content-scroll').on('click', 'li', function (e) {
        $(e.target).addClass('active').siblings().removeClass('active');
        $('.wrapCompanyPartners').show(1500);
        let partners = $(e.target).data('partners');
        let listCompanyPartners = '';
        for (let i=0; i<partners.length; i++){
            listCompanyPartners += `<div class="company-partners__item">
                                            <div class="company-partners__percent"><span>${partners[i].value}</span></div>
                                            <div class="company-partners__name"><span>${partners[i].name}</span></div>
                                    </div>`;
        }
        $('.company-partners').html(listCompanyPartners);
    });
});
//-----fn Initialization ChartJS-----
function initChart(data) {
    let chartData = {
        countries: [],
        percents: [],
        companies: []
    };
    delete data.ttlAmt;
    for(let key in data){
        chartData.countries.push(key);
        chartData.percents.push(data[key].percent);
        chartData.companies.push({
            countryTitle: key,
            companies: data[key].companies
        });
    }
    //-----ChartJS-----
    let ctx = document.getElementById('myChart').getContext('2d');
    let chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'pie',
        // The data for our data set
        data: {
            labels: chartData.countries,
            datasets: [{
                companies: chartData.companies,
                data: chartData.percents,
                backgroundColor: [
                    'darkgrey',
                    'lightgreen',
                    'orange',
                    'lightblue',
                    'pink',
                    'purple'
                ]
            }]
        },
        // Configuration options go here
        options: {
            legend: {
                display: false
            },
            responsive: true
        }
    });
    //Show companies by click on chart
    let canvas = document.getElementById('myChart');
    canvas.onclick = function (evt) {
        showCompanies(parseCountriesData(evt, chart));
    };
}
//fn parseCountriesData
function parseCountriesData(evt, chart) {
    let activePoints = chart.getElementsAtEvent(evt);
    let charData = activePoints[0]['_chart'].config.data;
    let idx = activePoints[0]['_index'];

    let countryData = charData.datasets[0].companies[idx];
    console.log(countryData);
    return countryData;
}
//fn countryData
function countryData (countries) {
    let objCountries = {
        ttlAmt: countries.length
    };
    countries.forEach((item)=>{
        let itemName = item.location.name;
        if (itemName in objCountries) {
            objCountries[itemName].amt++;
            objCountries[itemName].percent = objCountries[itemName].amt / objCountries.ttlAmt * 100;
            objCountries[itemName].companies.push(item.name);
        }
        else {
            objCountries[itemName] = {
                companies: [],
                percent: null,
                amt: 1
            };
        }
    });
    return objCountries;
}
//fn renderList
function renderList(array, parent, cb, option) {
    let multiple = option.multiple || true;
    $(parent).html('');
    for (let i=0; i<array.length; i++){
        let listCompany = `<li class="list-group-item list-group-item-action">${option.property ? array[i][option.property] : array[i]}</li>`;
        $(parent).append(listCompany);
        if (cb && multiple) {
            cb($(parent).find('li').eq(i), array[i]);
        }
    }
}
//fn showCompanies
function showCompanies(companies) {
    renderList(companies.companies, '.all-partners-list .company__content-scroll', ()=>{
        $('.all-partners-title').text(companies.countryTitle);
    }, {multiple: false});

    toggleVisibility(true);
}
//fn toggleVisibility
function toggleVisibility(state) {
    $('.company-location .company-data')[state ? 'hide' : 'show']('slow');
    $('.company-location .company-partners-data')[!state ? 'hide' : 'show']('slow');
}
//fn Initialization Slider
function initSlider() {
    $('#carouselExampleIndicators').carousel();
}
//fn formatDate in News Slider
function formatDate(date) {
    let month = ('0' + new Date(date).getMonth() + 1).slice(-2);
    return `${new Date(date).getDate()}.${month}.${new Date(date).getFullYear()}`;
}
//fn formatText in News Slider
function formatText(text) {
    let result = text;
    if(text.length > 121){
        result = `${text.slice(0, 121)}...`;
    }
    return result;
}