export default function classNames(
    styles: Record<string, string> = {},
    rootClassName = ""
) {
    const hasOwn = {}.hasOwnProperty;
    const func = (...classNames: unknown[]) => {
        const classes: unknown[] = [];

        if (classNames.length === 0) {
            // It's root
            classes.push(styles[rootClassName] || rootClassName);
        }

        for (let i = 0, max = classNames.length; i < max; i++) {
            const name = classNames[i];

            if (!name) {
                continue;
            }

            const nameType = typeof name;

            if (nameType === "string" || nameType === "number") {
                const nameWithRoot = rootClassName + name;
                classes.push(styles[nameWithRoot] || nameWithRoot);
                continue;
            }

            if (Array.isArray(name)) {
                func(name);
                continue;
            }

            if (nameType === "object") {
                // It's not null and array, so it must be an object.
                for (const key in name as object) {
                    const keyWithRoot = rootClassName + key;
                    if (
                        hasOwn.call(name, keyWithRoot) &&
                        name[keyWithRoot as keyof typeof name]
                    ) {
                        classes.push(styles[keyWithRoot] || keyWithRoot);
                    }
                }
            }
        }

        return classes.join(" ");
    };

    return func;
}