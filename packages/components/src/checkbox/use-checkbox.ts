export const useCheckbox = () => {
    function classNames(...classes: (string)[]) {
      return classes.filter(Boolean).join(' ');
    }
    return {
        classNames
    }
  }
  