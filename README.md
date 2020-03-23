# IBSP Web

Web frontend to display visualizations based on IBSP data. Manually syncs to the ssh gateway.

## How do I use this?

Data can be synced to the ssh gateway by logging in as ```inibsp``` and running the command ```bash auto_deploy.sh```. This will REMOVE the current webspace and download the latest from Gitlab.

### What format can uploaded files be in?

- Each uploaded file MUST contain a header row.

  - Further, only CSV formats are accepted. Although, if for some reason you have a JSON, there isn't much coercing you need to do.

  - Of the headers in the file, they MUST be in the form ```XYEAR_DESCRIPTION_EASTING|NORTHING_CRS```. 
    
    - ```X``` is an arbitrary character produced as an artifact of a RStudio export.
  - For example, ```X2010_shoreface_easting_wgs84```
  - Northing MUST follow Easting. Elevation may be present, but is ignored currently. Malformed header rows will be ignored and will have undefined behavior.

### How are the non-local files updated?

These files must be updated on the existing ```inibsp``` public folder. These files must follow the header naming convention specified above. 