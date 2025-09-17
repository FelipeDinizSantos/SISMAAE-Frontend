'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

import "./GraficoStatus.css";
import { Material } from '@/interfaces/Material.interface';
import { Modulo } from '@/interfaces/Modulo.interface';

// Registrar todos os componentes do Chart.js
Chart.register(...registerables);

export default function GraficoStatus({ itens }:{itens:Material[] | Modulo[]}) {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart<'pie'> | null>(null);

    useEffect(() => {
        if (!chartRef.current || itens.length === 0) return;

        const statusCount = {
            DISPONIVEL: 0,
            DISP_C_RESTRICAO: 0,
            INDISPONIVEL: 0,
            MANUTENCAO: 0
        };

        itens.forEach(material => {
            statusCount[material.Disponibilidade] += 1;
        });

        const data = {
            labels: ['Disponível', 'Disponível com Restrição', 'Indisponível', 'Manutenção'],
            datasets: [
                {
                    data: [
                        statusCount.DISPONIVEL,
                        statusCount.DISP_C_RESTRICAO,
                        statusCount.INDISPONIVEL,
                        statusCount.MANUTENCAO
                    ],
                    backgroundColor: [
                        '#4CAF50', 
                        '#FFC107', 
                        '#F44336', 
                        '#2196F3'  
                    ],
                    borderWidth: 1,
                },
            ],
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom' as const,
                },
                title: {
                    display: true,
                    text: 'Distribuição de Status'
                }
            }
        };

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(chartRef.current, {
            type: 'pie',
            data: data,
            options: options
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [itens]);

    if (itens.length === 0) {
        return <div className="grafico-container">Carregando dados para o gráfico...</div>;
    }

    return (
        <div className="grafico-container">
            <h3>Relação de Disponibilidade</h3>
            <div className="grafico-wrapper">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
}