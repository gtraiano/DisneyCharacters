import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux";
import { selectCharactersPages, selectFetcherStatus } from "../../store";
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import { VisibleCharacters } from "../../eventbus/events/VisibleCharacters";
import eventBus from "../../eventbus";
import { FetchingStatus } from "../../store/types";

Exporting(Highcharts);
ExportData(Highcharts); // for csv export

interface PieChartProps {
    width?: string,
    height?: string,
    containerStyling?: React.CSSProperties
}

const PieChart = ({ width, height, containerStyling }: PieChartProps) => {
    // reference to chart container
    const containerRef = useRef<HTMLDivElement>(null);
    // reference to pie chart
    const pieChart = useRef<Highcharts.Chart>();
    // visible character id's
    const [visibleIds, setVisibleIds] = useState<number[]>([]);
    const charactersPages = useSelector(selectCharactersPages);
    const fetcherStatus = useSelector(selectFetcherStatus);

    const onVisibleCharacters = (e: Event) => {
        const ids: number[] = (e as CustomEvent).detail;
        // save id's to local state
        setVisibleIds(ids);
    };
    
    useEffect(() => {
        eventBus.on(VisibleCharacters, onVisibleCharacters);
        return () => {
            eventBus.off(VisibleCharacters, onVisibleCharacters);
            pieChart.current?.destroy();
        }
    }, []);

    useEffect(() => {
        if(containerRef.current) {
            // create pie chart with empty series data and attach it to container div
            pieChart.current = Highcharts.chart({
                chart: {
                    renderTo: containerRef.current,
                    plotBackgroundColor: 'rgba(255,255,255,0)',
                    plotBorderWidth: undefined,
                    backgroundColor: 'rgba(255,255,255,0)',
                    borderColor: 'black',
                    borderWidth: 0.5,
                    borderRadius: 4,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Film appearances',
                    align: 'center',
                    style: {
                        fontWeight: 'bold'
                    }
                },
                tooltip: {
                    pointFormat: `<b>{point.percentage:.1f}%</b><br>{point.films}`
                },
                accessibility: {
                    point: {
                        valueSuffix: '%'
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y}'
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Characters',
                    colorByPoint: true,
                    data: []
                }],
                exporting: {
                    buttons: {
                        contextButton: {
                            theme: {
                                fill: 'rgba(255,255,255,0)'
                            }
                        }
                    }
                },
                credits: {
                    enabled: false
                }
            });
        }
    }, [containerRef.current]);

    // render chart for visibleIds
    useEffect(() => {
        // prevent flashing when fetching page from API
        if(fetcherStatus.status === FetchingStatus.LOADING && !visibleIds.length) return;
        // gather character data from store and format it as highchart series data
        const characters = visibleIds
            .flatMap(id => charactersPages.data.find(c => c._id === id) ?? [])
            .map(c => ({
                name: c.name,
                y: c.films.length,
                films: c.films.join('<br>') // all film titles joined with HTML line break
            }));
        // update chart
        if(pieChart.current) {
            pieChart.current.showLoading('calculating');
            pieChart.current.series[0].setData(characters);
            pieChart.current.redraw();
            pieChart.current.hideLoading();
        }
    }, [visibleIds]);

    useEffect(() => {
        pieChart.current?.reflow();
    }, [width, height]);
    
    return (
        <div className="pie-chart" ref={containerRef} style={{ width: width ?? '40vw', height: height ?? 'auto', ...containerStyling }} />
    );
};

export default PieChart;