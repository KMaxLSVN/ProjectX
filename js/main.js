$(function () {
//=======Getting COMPANY data=======
    $.ajax({
        type: "GET",
        //url: "http://codeit.pro/codeitCandidates/serverFrontendTest/company/getList",
        url: "./data/data.txt",
        success: function(msg){
            msg = JSON.parse(msg)[0];
            console.log(msg);
            //-----Loaders-----
            $('.company-data .loader').hide();
            //-----Rendering-----
            $('.company__total span').text(msg.list.length);

            renderList(msg.list, '.all-company-list', (elem, data)=>{
                elem.data({partners: (data).partners});
            }, {property: 'name'});
            //-----Initialization CHART-----
            initChart(countryData(msg.list));
        }
    });
    //-----Sorting numbers-----
    $('.company__title .fa-space-shuttle, .company__title .fa-universal-access').on('click', function () {
        // let partnersArr= $('.all-company-list li.active').data('partners');
        // if($(this).hasClass('sort-icon')){
        //     $(this).removeClass('sort-icon');
        //     partnersArr = sortArray(partnersArr, 'number', 'value', true);
        //     renderingPartners(partnersArr);
        //     $(this).data('sortType', true);
        // } else {
        //     $(this).addClass('sort-icon');
        //     partnersArr = sortArray(partnersArr, 'number', 'value', false);
        //     renderingPartners(partnersArr);
        //     $(this).data('sortType', false);
        // }
        let elem = $(this);
        console.log(elem);
        let state = elem.hasClass('sort-icon');
        let sortArrayOption = {
            array: $('.all-company-list li.active').data('partners'),
            type: elem.data('type'),
            property: elem.data('property'),
            state: state
        };
        renderingPartners(sortArray(sortArrayOption.array, sortArrayOption.type, sortArrayOption.property, sortArrayOption.state));
        elem.data('sortType', state);
        elem[state ? 'removeClass' : 'addClass' ]('sort-icon');
    });
//-----Company partners-----
    $('.company-data .company__content-scroll').on('click', 'li', function (e) {
        $(e.target).addClass('active').siblings().removeClass('active');
        $('.wrapCompanyPartners').show(1500);
        let partners = $(e.target).data('partners');
        //---fn Sorting---
        let sortState = $('.company__title .fa-space-shuttle').data('sortType');
        let flag = sortState === undefined ? true : sortState ;
        partners = sortArray(partners, 'number', 'value', flag);
        console.log(flag);
        renderingPartners(partners);
    });
//=======Getting NEWS data=======
    getNewsList((msg)=>{
        console.log(msg);
        //-----Loaders-----
        $('.news-data .loader').hide();
        //-----Rendering-----
        renderListNews(msg.list);
    });
});
//fn getNewsList
function getNewsList(cb){
    $.ajax({
        type: "GET",
        //url: "http://codeit.pro/codeitCandidates/serverFrontendTest/news/getList",
        url: "./data/companyList.txt",
        success: function(data){
            console.log(data);
            cb(JSON.parse(data)[0]);
        }
    });
}
//-----fn renderingPartners-----
function renderingPartners(array) {
    let listCompanyPartners = '';
    for (let i=0; i<array.length; i++){
        listCompanyPartners += `<div class="company-partners__item">
                                            <div class="company-partners__percent"><span>${array[i].value}</span></div>
                                            <div class="company-partners__name"><span>${array[i].name}</span></div>
                                    </div>`;
    }
    $('.company-partners').html(listCompanyPartners);
}
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
// function initSlider() {
//     $('#carouselExampleIndicators').carousel();
// }
//fn renderListNews
function renderListNews(array) {
    let listIndicator = '';
    let sliderItem = '';
    for (let i=0; i < array.length; i++){
        listIndicator += `<li data-target="#carouselExampleIndicators" data-slide-to="${i}" class="carousel-indicators__point"></li>`;
        sliderItem += `<div class="carousel-item">
                                    <div class="container">
                                        <div class="row">
                                            <div class="col-5">
                                                <div class="dataImg"><img src="${array[i].img}"></div>
                                            </div>
                                            <div class="col-7">
                                                <div class="title font-weight-bold">Title</div>
                                                <div class="text">${formatText(array[i].description)}</div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="font-weight-bold">Author:</div>
                                            <div class="author-data">${array[i].author}</div>
                                        </div>
                                        <div class="row">
                                            <div class="font-weight-bold">Public:</div>
                                            <div>${formatDate(+array[i].date)}</div>
                                        </div>
                                    </div>
                                </div>`;
    }
    $('.carousel-indicators').html(listIndicator);
    $('.carousel-inner').html(sliderItem);
    $('.carousel-indicators li:first-child, .carousel-inner .carousel-item:first-child').addClass('active');
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
        result = `${text.slice(0, 121).trim()}...`;
    }
    return result;
}
//fn Sorting
function sortArray(array, type, property, state) {
    let sortFn = null;
    switch(type){
        case 'number':
            console.log('number');
            sortFn = (a, b)=>{
                return a[property]-b[property];
            };
            break;
        case 'string':
            console.log('string');
            sortFn = (a, b)=> {
                a = a[property].toLowerCase();
                b = b[property].toLowerCase();
                return a > b ? -1 : b > a ? 1 : 0;
            };
            break;
    }
    let result = array.sort(sortFn);
    if(state){
        result.reverse();
    }
    return result;
}