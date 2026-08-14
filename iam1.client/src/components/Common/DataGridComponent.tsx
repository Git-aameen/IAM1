import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';

import 'ag-grid-community/styles/ag-theme-quartz.css';
import '../../styles/AGGridStyle.css';

ModuleRegistry.registerModules([ AllCommunityModule]);

interface Props {
    rowData: unknown[];
    columnDefs: ColDef[];
}

export function DataGridComponent({
    rowData,
    columnDefs
}: Props) {
    return (
        <div
            className="ag-theme-quartz ag-theme-iam1"
            style={{
                height: '600px',
                width: '100%'
            }}
        >
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={10}
                animateRows={true}
                defaultColDef={{
                    sortable: true,
                    filter: true,
                    resizable: true
                }}
            />
        </div>
    );
}