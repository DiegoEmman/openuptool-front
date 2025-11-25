import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ProjectPlan } from '../types/plan';

/**
 * Exporta un plan de proyecto a formato PDF
 */
export function exportPlanToPDF(plan: ProjectPlan, projectName: string): void {
    const doc = new jsPDF();
    let yPos = 20;

    // Título principal
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Plan del Proyecto: ${projectName}`, 14, yPos);
    yPos += 15;

    // Información general
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Versión: ${plan.version}`, 14, yPos);
    doc.text(`Creado: ${new Date(plan.createdAt).toLocaleDateString()}`, 100, yPos);
    yPos += 10;

    // Línea separadora
    doc.setDrawColor(200);
    doc.line(14, yPos, 196, yPos);
    yPos += 10;

    // Objetivos
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Objetivos del Proyecto', 14, yPos);
    yPos += 7;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const objectivesLines = doc.splitTextToSize(plan.objectives, 180);
    doc.text(objectivesLines, 14, yPos);
    yPos += objectivesLines.length * 6 + 10;

    // Verificar si necesitamos nueva página
    if (yPos > 250) {
        doc.addPage();
        yPos = 20;
    }

    // Alcance
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Alcance del Proyecto', 14, yPos);
    yPos += 7;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const scopeLines = doc.splitTextToSize(plan.scope, 180);
    doc.text(scopeLines, 14, yPos);
    yPos += scopeLines.length * 6 + 10;

    // Verificar espacio para tabla
    if (yPos > 220) {
        doc.addPage();
        yPos = 20;
    }

    // Cronograma Inicial (Tabla)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Cronograma por Fase', 14, yPos);
    yPos += 7;

    const scheduleData = plan.initialSchedule.map((s) => [
        s.phaseName,
        s.responsible || '-',
        s.startDate || 'No definido',
        s.endDate || 'No definido',
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [['Fase', 'Responsable', 'Fecha Inicio', 'Fecha Fin']],
        body: scheduleData,
        theme: 'grid',
        headStyles: {
            fillColor: [37, 99, 235], // Azul primario
            textColor: 255,
            fontStyle: 'bold',
        },
        styles: {
            fontSize: 10,
            cellPadding: 5,
        },
        columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 45 },
            2: { cellWidth: 45 },
            3: { cellWidth: 45 },
        },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Verificar espacio para hitos
    if (yPos > 220 || plan.milestones.length > 5) {
        doc.addPage();
        yPos = 20;
    }

    // Hitos del Proyecto (Tabla)
    if (plan.milestones.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Hitos del Proyecto', 14, yPos);
        yPos += 7;

        const milestonesData = plan.milestones.map((m) => [m.name, m.date, m.description || '-']);

        autoTable(doc, {
            startY: yPos,
            head: [['Hito', 'Fecha', 'Descripción']],
            body: milestonesData,
            theme: 'grid',
            headStyles: {
                fillColor: [37, 99, 235],
                textColor: 255,
                fontStyle: 'bold',
            },
            styles: {
                fontSize: 10,
                cellPadding: 5,
            },
            columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 35 },
                2: { cellWidth: 100 },
            },
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // Observaciones (si existen)
    if (plan.observations && plan.observations.trim()) {
        // Verificar si necesitamos nueva página
        if (yPos > 240) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Observaciones', 14, yPos);
        yPos += 7;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const observationsLines = doc.splitTextToSize(plan.observations, 180);
        doc.text(observationsLines, 14, yPos);
    }

    // Footer en todas las páginas
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150);
        doc.text(
            `Página ${i} de ${pageCount}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
        );
        doc.text('Generado por OpenUP Tool', 14, doc.internal.pageSize.height - 10);
        doc.text(
            new Date().toLocaleDateString(),
            doc.internal.pageSize.width - 14,
            doc.internal.pageSize.height - 10,
            { align: 'right' }
        );
    }

    // Guardar PDF
    const fileName = `plan-${projectName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    doc.save(fileName);
}
