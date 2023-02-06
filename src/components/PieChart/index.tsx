import { useEffect, useRef, useState } from "react"
import store from "../../store";
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import { VisibleCharacters } from "../../eventbus/events/VisibleCharacters";
import eventBus from "../../eventbus";
import { ShowModal } from "../../eventbus/events/ShowModal";

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

    const onVisibleCharacters = (e: Event) => {
        const ids: number[] = (e as CustomEvent).detail;
        if(!ids?.length) return;
        setVisibleIds(ids);
        // gather required data for visible characters id's
        const characters = ids
            .flatMap(id => store.getState().charactersPages.data.find(c => c._id === id) ?? [])
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
    };

    const onModalShow = () => {
        // [fixes bug] when modal opens only for the first time, the chart loses its content
        eventBus.emit(VisibleCharacters.eventName, visibleIds);
        setVisibleIds([]);
    };
    
    useEffect(() => {
        eventBus.on(VisibleCharacters.eventName, onVisibleCharacters);
        eventBus.once(ShowModal.eventName, onModalShow);
        return () => {
            eventBus.off(VisibleCharacters.eventName, onVisibleCharacters);
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

    useEffect(() => {
        pieChart.current?.reflow();
    }, [width, height]);
    
    return (
        <div ref={containerRef} style={{ width: width ?? '40vw', height: height ?? 'auto', ...containerStyling }} />
    );
};

export default PieChart;