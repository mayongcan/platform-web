
$(function () {
	initBarCharts1();
	initBarCharts2();
	initBarCharts3();
	initMapCharts();
});

function initMapCharts(){
	var charts = echarts.init(document.getElementById('mapCharts'));
	var myData = [
		{name: '虎门碧桂园一期工程', value: [113.657711,22.981816], addr: '东莞市虎门镇', status: '三级告警', person: '101人', number: '10个'},
		{name: '虎门工程', value: [113.740499,23.164816], addr: '东莞市虎门镇', status: '二级告警', person: '101人', number: '10个'},
		{name: '虎门一期工程', value: [113.648513,23.189267], addr: '东莞市虎门镇', status: '三级告警', person: '101人', number: '10个'},
	]
	var myData1 = [
		{name: '莞城金澳花园8栋工程', value: [113.810639,23.121216], addr: '东莞市莞城', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程1', value: [113.995761,23.042489], addr: '东莞市莞城', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程2', value: [113.86813,23.073347], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程3', value: [113.885378,23.033975], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程4', value: [113.818688,23.061643], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程4', value: [113.693931,23.039829], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程4', value: [113.752572,22.999914], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程4', value: [113.685307,22.988204], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程4', value: [113.640464,23.056855], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程4', value: [113.815238,23.048874], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程4', value: [113.719802,23.068559], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程4', value: [113.669209,23.091965], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程4', value: [113.716927,23.089306], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程4', value: [113.713478,22.982881], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程4', value: [113.692206,23.043553], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程4', value: [113.775569,22.934429], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程4', value: [113.804315,22.915257], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程4', value: [113.624941,23.007898], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程4', value: [113.639314,23.088242], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程4', value: [113.637589,23.099943], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程4', value: [113.722677,23.130256], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程4', value: [113.7313,22.930702], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
		{name: '东莞工程4', value: [113.723252,23.005769], addr: '东莞市虎门镇', status: '正常', person: '101人', number: '10个'},
	]

	option = {
	    title: {
	        x: 'left',
	        text: "当前区域：东莞市\n\n当前施工：45个\n\n告警工地：3个",
	        subtext: '',
	        textStyle: {
	            color: '#ddd',
	            fontSize: 14,
	        },
	        left: 20,
	        top:20,
	    },
	    tooltip: {
	        trigger: 'item',
	        transitionDuration: 0,
	        formatter: function(params) {
	            return "工地名称：" + params.name + '<br/>工地地址：' + params.data.addr + '<br/>预警状态：' + 
	            params.data.status + '<br/>现场人数：' + params.data.person + '<br/>监控探头：' + params.data.number;
	        },
	        extraCssText: 'border:2px solid #125997',
	    },
		bmap: {
	      	center: [113.774994,23.042489], // 中心位置坐标
	      	zoom: 11, // 地图缩放比例
	      	roam: true, // 开启用户缩放
	        mapStyle: {
	            'styleJson': [{
	                    "featureType": "water",
	                    "elementType": "all",
	                    "stylers": {
	                        "color": "#021019"
	                    }
	                }, {
	                    "featureType": "highway",
	                    "elementType": "geometry.fill",
	                    "stylers": {
	                        "color": "#000000"
	                    }
	                }, {
	                    "featureType": "highway",
	                    "elementType": "geometry.stroke",
	                    "stylers": {
	                        "color": "#147a92"
	                    }
	                }, {
	                    "featureType": "arterial",
	                    "elementType": "geometry.fill",
	                    "stylers": {
	                        "color": "#000000"
	                    }
	                }, {
	                    "featureType": "arterial",
	                    "elementType": "geometry.stroke",
	                    "stylers": {
	                        "color": "#0b3d51"
	                    }
	                }, {
	                    "featureType": "local",
	                    "elementType": "geometry",
	                    "stylers": {
	                        "color": "#000000"
	                    }
	                }, {
	                    "featureType": "land",
	                    "elementType": "all",
	                    "stylers": {
	                        "color": "#08304b"
	                    }
	                }, {
	                    "featureType": "railway",
	                    "elementType": "geometry.fill",
	                    "stylers": {
	                        "color": "#000000"
	                    }
	                }, {
	                    "featureType": "railway",
	                    "elementType": "geometry.stroke",
	                    "stylers": {
	                        "color": "#08304b"
	                    }
	                }, {
	                    "featureType": "subway",
	                    "elementType": "geometry",
	                    "stylers": {
	                        "lightness": -70
	                    }
	                }, {
	                    "featureType": "building",
	                    "elementType": "geometry.fill",
	                    "stylers": {
	                        "color": "#000000"
	                    }
	                }, {
	                    "featureType": "all",
	                    "elementType": "labels.text.fill",
	                    "stylers": {
	                        "color": "#857f7f"
	                    }
	                }, {
	                    "featureType": "all",
	                    "elementType": "labels.text.stroke",
	                    "stylers": {
	                        "color": "#000000"
	                    }
	                }, {
	                    "featureType": "building",
	                    "elementType": "geometry",
	                    "stylers": {
	                        "color": "#022338"
	                    }
	                }, {
	                    "featureType": "green",
	                    "elementType": "geometry",
	                    "stylers": {
	                        "color": "#062032"
	                    }
	                }, {
	                    "featureType": "boundary",
	                    "elementType": "all",
	                    "stylers": {
	                        "color": "#1e1c1c"
	                    }
	                }, {
	                    "featureType": "manmade",
	                    "elementType": "all",
	                    "stylers": {
	                        "color": "#022338"
	                    }
	            }]
	        }
	  	},
	    color: [
	        '#ff0022', '#0083ff'
	    ],
	    grid: {
	        left: '10%',
	        right: 200,
	        top: '15%',
	        bottom: '10%'
	    },
		series: [{
				name: '异常',
				type: 'scatter',
				coordinateSystem: 'bmap', // 坐标系使用bmap
				data: myData,
			},
			{
				name: '正常',
				type: 'scatter',
				coordinateSystem: 'bmap', // 坐标系使用bmap
				data: myData1,
			}
		]
	}
	charts.setOption(option);
}

function initBarCharts1(){
	var charts = echarts.init(document.getElementById('barCharts1'));
	var colors = ['#8cc749','#c881e1'];
	option = {
	    color: colors,
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'cross'
	        }
	    },
	    grid: {
	        right: '20%',
	        left: '20%'
	    },
	    legend: {
	        data:['企业数量','增速'],
            textStyle: {
                color: '#ddd'
            }
	    },
	    xAxis: [
	        {
	            type: 'category',
	            axisTick: {
	                alignWithLabel: true
	            },
	            data: ['2007','2008','2009','2010','2011','2012','2013','2014','2015','2016'],
		        axisLabel: {
	                show: true,
	                textStyle: {
	                    color: '#ddd'
	                },
	                interval:0,//横轴信息全部显示  
	                rotate:-60,//-30度角倾斜显示
	            }
	        }
	    ],
	    yAxis: [
	        {
	            type: 'value',
	            name: '',
	            min: 0,
	            max: 90000,
	            position: 'left',
	            axisLine: {
	                lineStyle: {
	                    color: colors[0]
	                }
	            },
	            axisLabel: {
	                formatter: '{value}'
	            }
	        },
	        {
	            type: 'value',
	            name: '',
	            min: 0,
	            max: 20,
	            position: 'right',
	            axisLine: {
	                lineStyle: {
	                    color: colors[1]
	                }
	            },
	            axisLabel: {
	                formatter: '{value} %'
	            }
	        },
	        {
	            type: 'value',
	            min: 0,
	            max: 25,
	            position: 'left',
	            axisLine: {
	                lineStyle: {
	                    color: colors[2]
	                }
	            },
	            axisLabel: {
	                formatter: '{value} %'
	            }
	        }
	    ],
	    series: [
	        {
	            name:'企业数量',
	            type:'bar',
	            data:[60000, 70000, 65000, 68000, 72000, 74000, 76000, 78000, 80000, 82000]
	        },
	        {
	            name:'增速',
	            type:'line',
	            yAxisIndex: 2,
	            data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5]
	        }
	    ]
	};
	charts.setOption(option);
}

function initBarCharts2(){
	var charts = echarts.init(document.getElementById('barCharts2'));
	var colors = ['#8cc749','#c881e1'];
	option = {
	    color: colors,
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'cross'
	        }
	    },
	    grid: {
	        right: '20%',
	        left: '20%'
	    },
	    legend: {
	        data:['从业人数','增速'],
            textStyle: {
                color: '#ddd'
            }
	    },
	    xAxis: [
	        {
	            type: 'category',
	            axisTick: {
	                alignWithLabel: true
	            },
	            data: ['江苏','山东','四川','河北','广东','江西','辽宁','广西','天津','宁夏'],
		        axisLabel: {
	                show: true,
	                textStyle: {
	                    color: '#ddd'
	                },
	                interval:0,//横轴信息全部显示  
	                rotate:-60,//-30度角倾斜显示
	            }
	        }
	    ],
	    yAxis: [
	        {
	            type: 'value',
	            name: '万人',
	            min: 0,
	            max: 900,
	            position: 'left',
	            axisLine: {
	                lineStyle: {
	                    color: colors[0]
	                }
	            },
	            axisLabel: {
	                formatter: '{value}'
	            }
	        },
	        {
	            type: 'value',
	            name: '',
	            min: -30,
	            max: 30,
	            position: 'right',
	            axisLine: {
	                lineStyle: {
	                    color: colors[1]
	                }
	            },
	            axisLabel: {
	                formatter: '{value} %'
	            }
	        },
	        {
	            type: 'value',
	            min: 0,
	            max: 25,
	            position: 'left',
	            axisLine: {
	                lineStyle: {
	                    color: colors[2]
	                }
	            },
	            axisLabel: {
	                formatter: '{value} %'
	            }
	        }
	    ],
	    series: [
	        {
	            name:'从业人数',
	            type:'bar',
	            data:[800, 700, 350, 330, 320, 300, 290, 250, 200, 160]
	        },
	        {
	            name:'增速',
	            type:'line',
	            yAxisIndex: 2,
	            data:[12.0, 12.2, 0.3, 4.5, 6.3, 5.2, 20.3, 8.4, 15.0, 16.5]
	        }
	    ]
	};
	charts.setOption(option);
}

function initBarCharts3(){
	var charts = echarts.init(document.getElementById('barCharts3'));
	var colors = ['#e49d4b', '#8cc749', '#51e4c7', '#c881e1'];
	option = {
	    color: colors,
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'cross'
	        }
	    },
	    grid: {
	        right: '20%',
	        left: '20%'
	    },
	    legend: {
	        data:['施工面积','竣工面积','施工增速','竣工增速'],
            textStyle: {
                color: '#ddd'
            }
	    },
	    xAxis: [
	        {
	            type: 'category',
	            axisTick: {
	                alignWithLabel: true
	            },
	            data: ['2007','2008','2009','2010','2011','2012','2013','2014','2015','2016'],
	            axisLabel: {
	                show: true,
	                textStyle: {
	                    color: '#ddd'
	                },
	                interval:0,//横轴信息全部显示  
	                rotate:-60,//-30度角倾斜显示
	            }
	        }
	    ],
	    yAxis: [
	        {
	            type: 'value',
	            name: '',
	            min: 0,
	            max: 150,
	            position: 'left',
	            axisLine: {
	                lineStyle: {
	                    color: colors[0]
	                }
	            },
	            axisLabel: {
	                formatter: '{value}'
	            }
	        },
	        {
	            type: 'value',
	            name: '',
	            min: 0,
	            max: 150,
	            position: 'right',
	            axisLine: {
	                lineStyle: {
	                    color: colors[1]
	                }
	            },
	            axisLabel: {
	                formatter: '{value} %'
	            }
	        },
	        {
	            type: 'value',
	            name: '',
	            min: 0,
	            max: 150,
	            position: 'left',
	            axisLine: {
	                lineStyle: {
	                    color: colors[2]
	                }
	            },
	            axisLabel: {
	                formatter: ''
	            }
	        }
	    ],
	    series: [
	        {
	            name:'施工面积',
	            type:'bar',
	            data:[40, 50, 60, 70, 80, 90, 95, 100, 105, 110, 105, 100]
	        },
	        {
	            name:'竣工面积',
	            type:'bar',
	            yAxisIndex: 1,
	            data:[20, 30, 40, 50, 60, 50, 45, 50, 60, 50, 60, 40]
	        },
	        {
	            name:'施工增速',
	            type:'line',
	            yAxisIndex: 2,
	            data:[120, 122, 33, 45, 63, 102, 103, 134, 130, 135, 120, 62]
	        },
	        {
	            name:'竣工增速',
	            type:'line',
	            yAxisIndex: 2,
	            data:[100, 112, 50, 70, 40, 90, 120, 100, 80, 140, 120, 100]
	        }
	    ]
	};
	charts.setOption(option);
}