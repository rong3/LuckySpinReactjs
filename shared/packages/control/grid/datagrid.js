import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { colors, TextField, withStyles } from "@material-ui/core";
import { Height } from '@material-ui/icons';
const styles = () => ({
    root: {
        dataGrid: {
            background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            borderRadius: 3,
            border: 0,
            color: "white",
            height: 48,
            padding: "0 30px",
            boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
            width: "640px"
        }
        // '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus': {
        //     outline: 'none !important',
        // },
        // "& .MuiDataGrid-renderingZone": {
        //     maxHeight: "none !important",
        //     minHeight: "auto !important",
        // },
        // "& .MuiDataGrid-row": {
        //     maxHeight: "none !important",
        //     minHeight: "auto !important",
        //     height: "30px",
        // },
        // "& . MuiDataGrid-cell": {
        //     maxHeight: "none !important",
        //     minHeight: "auto !important",
        //     height: "30px",
        // },
        // "& .MuiDataGrid-columnsContainer": {
        //     height: "30px",
        //     maxHeight: "none !important",
        //     minHeight: "auto !important",
        // }
    }
});
function DataGridControl({ rows, columns, pageSize, ...rest }) {
    const [pageSizeProps, setPageSizeProps] = React.useState(pageSize ?? 20);
    const classes = styles();
    // https://mui.com/api/data-grid/data-grid/
    // filter custom
    // https://mui.com/components/data-grid/filtering/
    return (
        <div style={{ width: "100%" }}>
            <DataGrid
                rows={rows}
                autoHeight
                columns={columns}
                rowHeight={65}
                disableExtendRowFullWidth={false}
                scrollbarSize={50}
                headerHeight={65}
                pageSize={pageSizeProps}
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
                onPageSizeChange={(newPageSize) => setPageSizeProps(newPageSize)}
                localeText={{
                    toolbarDensity: 'Size',
                    toolbarDensityLabel: 'Size',
                    toolbarDensityCompact: 'Small',
                    toolbarDensityStandard: 'Medium',
                    toolbarDensityComfortable: 'Large',
                }}
                // filterMode="server"
                // onFilterModelChange={handleFilterModelChange}
                {...rest}
            />
        </div>
    );
}
export default withStyles(styles)(DataGridControl);