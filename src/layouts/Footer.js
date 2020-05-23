import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
		links={[
		    {
		      key: '关于我们',
		      title: '关于我们',
		      blankTarget: true,
		    },
		    {
		      key: '联系我们',
		      title: '联系我们',
		      blankTarget: true,
		    },
		    {
		      key: '服务状态',
		      title: '服务状态',
		      blankTarget: true,
		    },
		    {
		      key: '帮助文档',
		      title: '帮助文档',
		      blankTarget: true,
		    },
		    {
		      key: '隐私政策',
		      title: '隐私政策',
		      blankTarget: true,
		    },
		  ]}
      copyright={
        <Fragment>
          <Icon type="copyright" /> 2020 minerbyte
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
