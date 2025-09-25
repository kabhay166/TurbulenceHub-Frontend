import {MathJax,MathJaxContext} from "better-react-mathjax";
import styles from "@/pages/models/HydroModel.module.css";

export default function RbcModel() {

    return <MathJaxContext> <div className={styles.container}>
        <h1>The Rayleigh-Benard Convection (RBC) Model</h1>

        <div className={styles.content}>
            <div className={styles.brief}>
                <h2>Brief Description:</h2>

                <p>
                    The Rayleigh–Bénard model describes buoyancy-driven convection in a fluid layer heated from below and cooled
                    from above. Governed by the Navier–Stokes equations coupled with the heat equation under the Boussinesq
                    approximation, it captures the transition from laminar convection rolls to turbulent convection as the
                    Rayleigh number increases. This model serves as a fundamental system for studying thermal convection,
                    turbulence, and pattern formation in geophysical and astrophysical flows.
                </p>
            </div>

            <div className={styles.governingEquations}>
                <h2>Governing Equations:</h2>
                <p>
                    <RayleighBenardEquation />
                </p>
            </div>
        </div>

    </div>
    </MathJaxContext>
}


function RayleighBenardEquation() {
    return (
        <div>
            <p>
                Continuity equation:
                <MathJax>{"\\( \\nabla \\cdot u = 0 \\)"}</MathJax>
            </p>

            <p>
                Momentum equation (with buoyancy):
                <MathJax>
                    {
                        "\\( \\frac{\\partial u}{\\partial t} + (u \\cdot \\nabla)u = -\\nabla p + \\nu \\nabla^2 u + RaPr \\, \\theta \\, \\hat{z} \\)"
                    }
                </MathJax>
            </p>

            <p>
                Temperature equation:
                <MathJax>
                    {
                        "\\( \\frac{\\partial \\theta}{\\partial t} + (u \\cdot \\nabla)\\theta = \\kappa \\nabla^2 \\theta \\)"
                    }
                </MathJax>
            </p>
        </div>
    );
}
