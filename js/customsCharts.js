var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
        labels: [
            'USA',
            'UK',
            'RUS'
        ],
        datasets: [{
            data: [45, 25, 10],
            backgroundColor: [
                'darkgrey',
                'grey',
                'black'
            ]
        }]
    },

    // Configuration options go here
    options: {
        legend: {
            display: false
        },
        responsive: false
    }
});