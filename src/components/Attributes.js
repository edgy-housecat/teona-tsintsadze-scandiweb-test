import { Component } from 'react';
import clsx from 'clsx';

import '../styles/attributes.css';

class Attributes extends Component {
    render() {
        const {
            attributes: { items, name },
            selectedAttribute,
            selectAttribute = () => {}
        } = this.props;

        const isColor = name === 'Color';
        const attributesItems = items.map((item) => (
            <button
                key={item.id}
                className={clsx({
                    'selected-item': item.id === selectedAttribute,
                    'items': true,
                    'other-attribute': !isColor,
                    'color-attribute': isColor,
                })}
                onClick={() => selectAttribute(name, item.id)}
            >
                {!isColor && <h3>{item.value}</h3>}
                {isColor && <div style={{ backgroundColor: item.value }}></div>}
            </button>
        ));
        return (
            <div>
                <h3 className="attribute-title">{`${name.toUpperCase()}:`}</h3>
                <div className="attribute-items">{attributesItems}</div>
            </div>
        );
    }
}

export default Attributes;
