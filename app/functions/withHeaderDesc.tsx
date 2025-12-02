import React from 'react';
import HeaderLabel from '../components/HeaderLabel';
import Description from '../components/Description';
import Divider from '../components/Divider';
import LabelContainer from 'labelcontainer';

function withHeaderDesc<P extends object>(Component: React.ComponentType<P>, key: string) {
  const lsInstance = LabelContainer.getInstance();
  // eslint-disable-next-line react/display-name
  return (props: P) => {
    return (
      <div className="flex flex-col mb-4">
        <HeaderLabel>{lsInstance.getLabel(`header_${key}`)}</HeaderLabel>
        <Description>{lsInstance.getLabel(`header_desc_${key}`)}</Description>
        <Divider />
        <div>
          <Component {...props} />
        </div>
      </div>
    );
  };
}

export default withHeaderDesc;
