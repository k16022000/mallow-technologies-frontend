import React from 'react';
import { Skeleton } from '@mui/material';
import styles from './styles/tableLoader.module.scss';

interface TableLoaderProps {
  noOfRows?: number;
  varientType?: 'text' | 'rectangular' | 'circular';
  width?: number | string;
  height?: number | string;
  columns?: number;
}

const TableLoader: React.FC<TableLoaderProps> = ({
  noOfRows = 5,
  varientType = 'text',
  width = '80%',
  height = 20,
  columns = 4,
}) => {
  return (
    <div>
      {Array.from({ length: noOfRows }).map((_, rowIndex) => (
        <div className={styles.tablerow} key={`row-${rowIndex}`}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`col-${colIndex}`}
              variant={varientType}
              width={width}
              height={height}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableLoader;
