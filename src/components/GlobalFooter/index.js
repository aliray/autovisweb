import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const GlobalFooter = ({ className, links, copyright }) => {
  const clsString = classNames(styles.globalFooter, className);
  return (
    <footer>
      <div className={styles.footcss}>
         <div style={{float:'left',marginLeft:'5px'}}>
           <span>V1.0.0</span>
           <span style={{marginLeft:'20px'}}>联系我们:test@minerbyte.com</span>
           <span style={{marginLeft:'20px'}}>{copyright}</span>
         </div>
         <div style={{float:'right',marginRight:'5px'}}>
          <a><span style={{color: '#969DA6',marginLeft:'20px'}}>关于我们</span></a>
          <a><span style={{color: '#969DA6',marginLeft:'20px'}}>服务状态</span></a>
          <a><span style={{color: '#969DA6',marginLeft:'20px'}}>帮助文档</span></a>
          <a><span style={{color: '#969DA6',marginLeft:'20px'}}>使用条款</span></a>
          <a><span style={{color: '#969DA6',marginLeft:'20px'}}>隐私政策</span></a>
         </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
