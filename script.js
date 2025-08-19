document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const arrayContainer = document.getElementById('array-container');
    const generateBtn = document.getElementById('generate-btn');
    const sortBtn = document.getElementById('sort-btn');
    const resetBtn = document.getElementById('reset-btn');
    const arraySizeSlider = document.getElementById('array-size');
    const speedSlider = document.getElementById('speed');
    const algorithmSelect = document.getElementById('algorithm');
    const sizeValue = document.getElementById('size-value');
    const speedValue = document.getElementById('speed-value');
    const comparisonsDisplay = document.getElementById('comparisons');
    const swapsDisplay = document.getElementById('swaps');
    const timeDisplay = document.getElementById('time');
    const algorithmInfo = document.getElementById('algorithm-info');
  
    // State variables
    let array = [];
    let isSorting = false;
    let animationSpeed = 100;
    let comparisons = 0;
    let swaps = 0;
    let startTime = 0;
    
    // Algorithm information
    const algorithmDetails = {
      bubble: {
        name: "Bubble Sort",
        description: "Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        complexity: {
          time: {
            best: "O(n)",
            average: "O(n²)",
            worst: "O(n²)"
          },
          space: "O(1)"
        }
      },
      selection: {
        name: "Selection Sort",
        description: "Selection Sort divides the input list into two parts: a sorted sublist and an unsorted sublist. It repeatedly selects the smallest element from the unsorted sublist and moves it to the sorted sublist.",
        complexity: {
          time: {
            best: "O(n²)",
            average: "O(n²)",
            worst: "O(n²)"
          },
          space: "O(1)"
        }
      },
      insertion: {
        name: "Insertion Sort",
        description: "Insertion Sort builds the final sorted array one item at a time by repeatedly taking the next item and inserting it into the correct position in the already sorted part.",
        complexity: {
          time: {
            best: "O(n)",
            average: "O(n²)",
            worst: "O(n²)"
          },
          space: "O(1)"
        }
      },
      merge: {
        name: "Merge Sort",
        description: "Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, sorts each half recursively, and then merges the two sorted halves.",
        complexity: {
          time: {
            best: "O(n log n)",
            average: "O(n log n)",
            worst: "O(n log n)"
          },
          space: "O(n)"
        }
      },
      quick: {
        name: "Quick Sort",
        description: "Quick Sort is a divide-and-conquer algorithm that selects a 'pivot' element and partitions the array around the pivot, placing smaller elements before it and larger elements after it.",
        complexity: {
          time: {
            best: "O(n log n)",
            average: "O(n log n)",
            worst: "O(n²)"
          },
          space: "O(log n)"
        }
      }
    };
  
    // Initialize the app
    function init() {
      updateAlgorithmInfo();
      generateNewArray();
      setupEventListeners();
    }
  
    // Set up event listeners
    function setupEventListeners() {
      generateBtn.addEventListener('click', generateNewArray);
      sortBtn.addEventListener('click', startSorting);
      resetBtn.addEventListener('click', reset);
      arraySizeSlider.addEventListener('input', updateSizeValue);
      speedSlider.addEventListener('input', updateSpeedValue);
      algorithmSelect.addEventListener('change', updateAlgorithmInfo);
    }
  
    // Update array size display
    function updateSizeValue() {
      sizeValue.textContent = arraySizeSlider.value;
      if (!isSorting) {
        generateNewArray();
      }
    }
  
    // Update speed display and calculate animation speed
    function updateSpeedValue() {
      const speed = speedSlider.value;
      speedValue.textContent = speed;
      // Convert speed (1-10) to delay in ms (100ms to 10ms)
      animationSpeed = 110 - (speed * 10);
    }
  
    // Update algorithm information display
    function updateAlgorithmInfo() {
      const selectedAlgorithm = algorithmSelect.value;
      const info = algorithmDetails[selectedAlgorithm];
      
      algorithmInfo.querySelector('.info-content').innerHTML = `
        <h4>${info.name}</h4>
        <p>${info.description}</p>
        <div class="complexity">
          <h5>Time Complexity:</h5>
          <ul>
            <li>Best Case: ${info.complexity.time.best}</li>
            <li>Average Case: ${info.complexity.time.average}</li>
            <li>Worst Case: ${info.complexity.time.worst}</li>
          </ul>
          <h5>Space Complexity: ${info.complexity.space}</h5>
        </div>
      `;
    }
  
    // Generate a new random array
    function generateNewArray() {
      if (isSorting) return;
      
      const size = parseInt(arraySizeSlider.value);
      array = [];
      
      for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 5); // Values between 5 and 105
      }
      
      renderArray();
      resetStats();
    }
  
    // Render the array as bars
    function renderArray() {
      arrayContainer.innerHTML = '';
      const maxHeight = Math.max(...array);
      
      array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.style.height = `${(value / maxHeight) * 100}%`;
        bar.setAttribute('data-value', value);
        bar.setAttribute('data-index', index);
        arrayContainer.appendChild(bar);
      });
    }
  
    // Reset statistics
    function resetStats() {
      comparisons = 0;
      swaps = 0;
      updateStats();
    }
  
    // Update statistics display
    function updateStats() {
      comparisonsDisplay.textContent = comparisons;
      swapsDisplay.textContent = swaps;
      
      if (startTime) {
        const elapsedTime = Date.now() - startTime;
        timeDisplay.textContent = `${elapsedTime} ms`;
      }
    }
  
    // Reset the visualization
    function reset() {
      if (isSorting) return;
      generateNewArray();
    }
  
    // Start the sorting process
    function startSorting() {
      if (isSorting || array.length === 0) return;
      
      isSorting = true;
      resetStats();
      startTime = Date.now();
      
      const algorithm = algorithmSelect.value;
      
      switch (algorithm) {
        case 'bubble':
          bubbleSort();
          break;
        case 'selection':
          selectionSort();
          break;
        case 'insertion':
          insertionSort();
          break;
        case 'merge':
          mergeSort();
          break;
        case 'quick':
          quickSort();
          break;
        default:
          isSorting = false;
      }
    }
  
    // Helper function to swap two elements in the array
    async function swap(i, j) {
      const bars = document.querySelectorAll('.array-bar');
      
      // Highlight the elements being swapped
      bars[i].classList.add('comparing');
      bars[j].classList.add('comparing');
      
      // Wait for animation
      await sleep(animationSpeed);
      
      // Swap the values
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
      
      // Update the display
      bars[i].style.height = `${(array[i] / 100) * 100}%`;
      bars[j].style.height = `${(array[j] / 100) * 100}%`;
      bars[i].setAttribute('data-value', array[i]);
      bars[j].setAttribute('data-value', array[j]);
      
      // Remove highlight
      bars[i].classList.remove('comparing');
      bars[j].classList.remove('comparing');
      
      swaps++;
      updateStats();
    }
  
    // Helper function to mark elements as being compared
    async function compare(i, j) {
      const bars = document.querySelectorAll('.array-bar');
      bars[i].classList.add('current');
      bars[j].classList.add('current');
      
      await sleep(animationSpeed);
      
      comparisons++;
      updateStats();
      
      bars[i].classList.remove('current');
      bars[j].classList.remove('current');
      
      return array[i] > array[j];
    }
  
    // Helper function to mark an element
    async function mark(index, className = 'current') {
      const bars = document.querySelectorAll('.array-bar');
      bars[index].classList.add(className);
      await sleep(animationSpeed);
    }
  
    // Helper function to unmark an element
    async function unmark(index, className = 'current') {
      const bars = document.querySelectorAll('.array-bar');
      bars[index].classList.remove(className);
      await sleep(animationSpeed);
    }
  
    // Helper function to mark an element as sorted
    async function markSorted(index) {
      const bars = document.querySelectorAll('.array-bar');
      bars[index].classList.add('sorted');
      await sleep(animationSpeed);
    }
  
    // Sleep function for animations
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    // Sorting Algorithms
  
    // Bubble Sort
    async function bubbleSort() {
      const len = array.length;
      
      for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - i - 1; j++) {
          if (await compare(j, j + 1)) {
            await swap(j, j + 1);
          }
        }
        await markSorted(len - 1 - i);
      }
      
      // Mark all as sorted when done
      const bars = document.querySelectorAll('.array-bar');
      bars.forEach(bar => bar.classList.add('sorted'));
      
      isSorting = false;
    }
  
    // Selection Sort
    async function selectionSort() {
      const len = array.length;
      
      for (let i = 0; i < len - 1; i++) {
        let minIndex = i;
        
        await mark(minIndex, 'pivot');
        
        for (let j = i + 1; j < len; j++) {
          if (await compare(j, minIndex)) {
            await unmark(minIndex, 'pivot');
            minIndex = j;
            await mark(minIndex, 'pivot');
          }
        }
        
        if (minIndex !== i) {
          await swap(i, minIndex);
        }
        
        await markSorted(i);
        await unmark(minIndex, 'pivot');
      }
      
      await markSorted(len - 1);
      isSorting = false;
    }
  
    // Insertion Sort
    async function insertionSort() {
      const len = array.length;
      
      for (let i = 1; i < len; i++) {
        let j = i;
        
        await mark(j);
        
        while (j > 0 && await compare(j - 1, j)) {
          await swap(j - 1, j);
          j--;
        }
        
        await unmark(j);
        await markSorted(j);
      }
      
      // Mark all as sorted when done
      const bars = document.querySelectorAll('.array-bar');
      bars.forEach(bar => bar.classList.add('sorted'));
      
      isSorting = false;
    }
  
    // Merge Sort
    async function mergeSort(start = 0, end = array.length - 1) {
      if (start >= end) return;
      
      const mid = Math.floor((start + end) / 2);
      
      await mergeSort(start, mid);
      await mergeSort(mid + 1, end);
      await merge(start, mid, end);
      
      if (start === 0 && end === array.length - 1) {
        // Mark all as sorted when done
        const bars = document.querySelectorAll('.array-bar');
        for (let i = 0; i < bars.length; i++) {
          await markSorted(i);
        }
        isSorting = false;
      }
    }
  
    async function merge(start, mid, end) {
      const leftArray = array.slice(start, mid + 1);
      const rightArray = array.slice(mid + 1, end + 1);
      
      let i = 0, j = 0, k = start;
      
      // Highlight the current merge range
      const bars = document.querySelectorAll('.array-bar');
      for (let x = start; x <= end; x++) {
        bars[x].classList.add('current');
      }
      await sleep(animationSpeed);
      
      while (i < leftArray.length && j < rightArray.length) {
        comparisons++;
        updateStats();
        
        if (leftArray[i] <= rightArray[j]) {
          array[k] = leftArray[i];
          i++;
        } else {
          array[k] = rightArray[j];
          j++;
        }
        
        // Update the display
        bars[k].style.height = `${(array[k] / 100) * 100}%`;
        bars[k].setAttribute('data-value', array[k]);
        
        await sleep(animationSpeed);
        k++;
      }
      
      while (i < leftArray.length) {
        array[k] = leftArray[i];
        bars[k].style.height = `${(array[k] / 100) * 100}%`;
        bars[k].setAttribute('data-value', array[k]);
        await sleep(animationSpeed);
        i++;
        k++;
      }
      
      while (j < rightArray.length) {
        array[k] = rightArray[j];
        bars[k].style.height = `${(array[k] / 100) * 100}%`;
        bars[k].setAttribute('data-value', array[k]);
        await sleep(animationSpeed);
        j++;
        k++;
      }
      
      // Remove highlight
      for (let x = start; x <= end; x++) {
        bars[x].classList.remove('current');
      }
    }
  
    // Quick Sort
    async function quickSort(start = 0, end = array.length - 1) {
      if (start >= end) return;
      
      const pivotIndex = await partition(start, end);
      
      await quickSort(start, pivotIndex - 1);
      await quickSort(pivotIndex + 1, end);
      
      if (start === 0 && end === array.length - 1) {
        // Mark all as sorted when done
        const bars = document.querySelectorAll('.array-bar');
        for (let i = 0; i < bars.length; i++) {
          await markSorted(i);
        }
        isSorting = false;
      }
    }
  
    async function partition(start, end) {
      const pivotValue = array[end];
      let pivotIndex = start;
      
      const bars = document.querySelectorAll('.array-bar');
      
      // Highlight pivot
      await mark(end, 'pivot');
      
      for (let i = start; i < end; i++) {
        if (await compare(i, end)) {
          if (i !== pivotIndex) {
            await swap(i, pivotIndex);
          }
          pivotIndex++;
        }
      }
      
      await swap(pivotIndex, end);
      await unmark(end, 'pivot');
      
      return pivotIndex;
    }
  
    // Initialize the application
    init();
  });