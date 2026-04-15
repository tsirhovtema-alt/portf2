import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <div id="triangle" className={styles.triangle}>
      <svg
        id="Layer_1"
        data-name="Layer 1"
        version="1.1"
        viewBox="0 0 2000 2000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          className={styles.cls1}
          points="928 781 1021 951 784.5 1371.97 1618 1371.97 1530.32 1544 509 1539 928 781"
        />
        <polygon
          className={styles.cls3}
          points="1618 1371.97 784.5 1371.97 874.93 1211 1346 1211 923.1 456 1110.06 456 1618 1371.97"
        />
        <g id="Layer_2" data-name="Layer 2">
          <polygon
            className={styles.cls2}
            points="418 1372.74 509 1539 928 781 1162.32 1211 1346 1211 923.1 456 418 1372.74"
          />
        </g>
      </svg>
    </div>
  );
}
