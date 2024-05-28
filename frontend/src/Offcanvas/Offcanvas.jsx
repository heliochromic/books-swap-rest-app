import React from 'react';
import "./Offcanvas.css";

const Offcanvas = () => {
    return (
        <section className="offcanvasContainer">
            <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasWithBothOptions"
                aria-labelledby="offcanvasWithBothOptions">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasWithBothOptions">Backdrop with scrolling</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <p>Try scrolling the rest of the page to see this option in action.</p>
                </div>
            </div>
        </section>
    );
};

export default Offcanvas;
