import React from 'react';
import styles from './styles/NullDataReplacement.module.scss';

interface NullDataReplacementProps {
  text?: string;
}

const NullDataReplacement: React.FC<NullDataReplacementProps> = ({ text = 'No Data Found' }) => {
  return <div className={styles.NullDataReplacement}>{text}</div>;
};

export default NullDataReplacement;
