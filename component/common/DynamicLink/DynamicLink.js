import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { withRouter } from "next/router";
import { serialize, handleUrl } from "../../../shared/packages/utils/urlHelper";

const DynamicLink = React.memo(function DynamicLink(props) {
  const { href, as, children, router, scroll } = props;
  const [remapLink, setRemapLink] = useState({
    href: null,
    as: null
  })

  useEffect(() => {
    if (href && as) {
      remapLink.href = href.replace("//", "/");
      remapLink.as = as.replace("//", "/");;
      setRemapLink({ ...remapLink });
    }
  }, [href, as])


  return (
    (href?.charAt(0) === '/') ?
      <Link
        href={`${serialize(remapLink.href, {})}`}
        as={handleUrl(remapLink.as, "")}
        scroll={scroll}
      >
        {children}
      </Link>
      :
      <Link
        href={`${serialize(href)}`}
        as={handleUrl(as)}
        scroll={scroll}
      >
        {children}
      </Link>
  );
});

DynamicLink.propTypes = {
  href: PropTypes.string.isRequired,
  as: PropTypes.string.isRequired
  // children: PropTypes.element.isRequired
};
DynamicLink.defaultProps = {
  scroll: true
};

export default withRouter(DynamicLink);
